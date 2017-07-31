import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import reactCSS from 'reactcss'
import { SketchPicker } from 'react-color';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         triggerUpdatingGameStart,
         currentWordGenerating,
         turnChangingLogic,
         strokeUpdator,
         strokeClear,
         undoRecent } from '../../../firebase';
import firebase from '../../../firebase';

import './Canvas.css';

// Import Actions
import { updateGameStart } from '../../../actions/gameActions';
import { updateCurrentTurn } from '../../../actions/turnActions';

// Import child
import ChatInput from '../ChatInput/ChatInput';

export class Canvas extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.drawings = [];
    this.weightTool = {};
    this.state = {
      countDown1: [],
      countDown2: [],
      countDown3: [],
      gameStartNotice: [],
      correctAnswerNotice: [],
      turnNotice: [],
      displayColorPicker: false,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '100'
      },
      weightPick: 3,
      eraser: false
    }
  }

  componentDidMount() {
    let newItems = false;

    /* Need a logic for preventing rerender whan user reload by redux and stage, turnNum */
    const winnerRef = firebase.database().ref('rooms/' + this.props.roomkey + '/winnerOfStage');
    winnerRef.on('child_added', (data) => {
      if(data.val() !== 'init' && newItems) {
        this.setState({
          correctAnswerNotice : [{classname:'correctAnswerNotice startHide',
                                    name:data.val().name}]
        })
        setTimeout(() => this.setState({ correctAnswerNotice: [] }), 1000)
      }
    })
    const startRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    const countDownRef = firebase.database().ref('rooms/' + this.props.roomkey + '/countDownStarted');
    startRef.on('value', (data) => {
      if(data.val()) {
        winnerRef.once('value', (data) => {
          turnNoticeRef.once('value', (data) => {
            newItems = true;
          })
        })
        countDownRef.once('value', (data) => {
          if(data.val() === false) {
            this.start3();
            setTimeout(() => this.start2(), 1000);
            setTimeout(() => this.start1(), 2000);
            setTimeout(() => this.realStart(), 3000);
            countDownRef.update({ 'countDownStarted': true });
          }
        })
      }
    })
    const turnNoticeRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnNoticeRef.on('value', (data) => {
      if (newItems) {
        setTimeout(() => {
          if(this.props.user[0].id === this.props.turnInfo.id) {
            this.setState({ turnNotice: ['turnNoticeText startHide'] });
            setTimeout(() => this.setState({ turnNotice: [] }), 1500)
          }
        }, 1000)
      }
    })

    /**
    * Event Listener of mouse
    */
    const canvas = document.getElementById('whiteBoard');
    const ctx = canvas.getContext("2d");
    // getting local settings
    let cRect = canvas.getBoundingClientRect();
    let aspect = canvas.clientWidth / canvas.clientHeight;
    let resizeCanvas;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    let drawing = false;

    // Canvas Drawing Logic for init loading and add_child.
    const redraw = () => {
      // getting the latest element from the this.drawings array.
      const curIdx = this.drawings.length - 1;
      const pastIdx = this.drawings.length - 2;
      const arr = this.drawings;
      // getting tool settings
      const color = arr[curIdx].cl;
      ctx.strokeStyle = `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`;
      ctx.lineJoin = 'round';
      ctx.lineWidth = arr[curIdx].wg;

      ctx.beginPath();
      // condition for clicking(just dot) or dragging(line)
      if (arr.length > 1 && arr[pastIdx].mv === 'drag') {
        ctx.moveTo(arr[pastIdx].mX * canvas.width , arr[pastIdx].mY * canvas.height)
      }
      if(arr[curIdx].mv === ('start' || 'end')) {
        ctx.moveTo(arr[curIdx].mX * canvas.width  - 1, arr[curIdx].mY * canvas.height)
      }
      ctx.lineTo(arr[curIdx].mX * canvas.width , arr[curIdx].mY * canvas.height);
      ctx.closePath();
      ctx.stroke();
    }
    // Canvas Drawing Logic for undo.
    const redrawAll = () => {
      this.drawings.forEach((e, i) => {
        const arr = this.drawings;
        const color = arr[i].cl;

        ctx.strokeStyle = `rgba(${ color.r }, ${ color.g }, ${ color.b }, ${ color.a })`;
        ctx.lineJoin = 'round';
        ctx.lineWidth = arr[i].wg;

        ctx.beginPath();
        ctx.moveTo(arr[i].mX * canvas.width, arr[i].mY * canvas.height)
        if (i < arr.length - 1 && arr[i].mv !== 'end') {
          ctx.lineTo(arr[i + 1].mX * canvas.width, arr[i + 1].mY * canvas.height);
        }
        ctx.closePath();
        ctx.stroke();
      })
    }

    // helper function for caculating mouse coordinate.
    const coordinator = (e, move, aspect, color, weight) => {
      const cRect = canvas.getBoundingClientRect();
      const mX = (e.clientX - cRect.left) / canvas.width;
      const mY = (e.clientY - cRect.top) / canvas.height;
      const mv = move;
      const ap = aspect;
      let cl = color;
      if (this.state.eraser) cl = { r: '255', g: '255', b: '255', a: '100' }
      const wg = weight;
      return { mX, mY, mv, ap, cl, wg }
    }


    // Event Listners.
    const uid = this.props.user[0].id;
    canvas.addEventListener('mousedown', (e) => {
      const mouseXY = coordinator(e, 'start', aspect, this.state.color, this.state.weightPick);
      if (this.props.gameStartInfo && this.props.turnInfo.id === uid) {
        strokeUpdator(this.props.roomkey, mouseXY);
        drawing = true;
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      if(drawing && this.props.gameStartInfo && this.props.turnInfo.id === uid) {
        const mouseXY = coordinator(e, 'drag', aspect, this.state.color, this.state.weightPick);
        strokeUpdator(this.props.roomkey, mouseXY, this.props.gameStartInfo);
      }
    });
    canvas.addEventListener('mouseup', (e) => {
      const mouseXY = coordinator(e, 'end', aspect, this.state.color, this.state.weightPick);
      if (this.props.gameStartInfo && this.props.turnInfo.id === uid) {
        strokeUpdator(this.props.roomkey, mouseXY);
        drawing = false;
      }
    });
    canvas.addEventListener('mouseleave', (e) => {
      drawing = false;
    });

    // Event Receivers.
    const strokeRef = firebase.database().ref('rooms/' + this.props.roomkey + '/stroke');
    strokeRef.on('child_added', (data) => {
      this.drawings.push(data.val());
      redraw();
    })
    strokeRef.on('child_removed', (data) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      this.drawings.pop()
      if (data.val().mv === 'end') redrawAll();
    })

    // Resize canvas and Rerender drawings if user resize the window.
    window.addEventListener('resize', () => {
      clearTimeout(resizeCanvas);
      // setTimeout for optimazation on performance.
      resizeCanvas = setTimeout(() => {
        // updating local settings.
        cRect = canvas.getBoundingClientRect();
        aspect = canvas.clientWidth / canvas.clientHeight;
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
        // getting drawing information from firebase
        firebase.database().ref('rooms/' + this.props.roomkey + '/stroke')
          .once('value')
          .then((snapshot) => {
            const strokes = snapshot.val();
            // resetting
            this.drawings = [];
            for (const key in strokes) {
              // pushing the information and render that one by one.
              this.drawings.push(strokes[key]);
              redraw();
            }
          })
      }, 500);
    })


  } // componentDidMount Ends.


  /**
   * Notice Message Related
   */

  gameStartNotice = () => {
    const returnArr = [];
    this.state.gameStartNotice.forEach((e) => {
      returnArr.push(<div className={e}
                          key={uuid()}>GAME START!</div>)
    });
    return returnArr;
  };

  countDown1 = () => {
    const returnCountDown1 = [];
    this.state.countDown1.forEach((e) => {
      returnCountDown1.push(<div className={e} key={uuid()}>1</div>)
    });
    return returnCountDown1;
  }

  countDown2 = () => {
    const returnCountDown2 = [];
    this.state.countDown2.forEach((e) => {
      returnCountDown2.push(<div className={e} key={uuid()}>2</div>)
    });
    return returnCountDown2;
  }

  countDown3 = () => {
    const returnCountDown3 = [];
    this.state.countDown3.forEach((e) => {
      returnCountDown3.push(<div className={e} key={uuid()}>3</div>)
    });
    return returnCountDown3;
  }

  start3 = () => {
      this.setState({ countDown3: ['countDown3 countDownStartHide'] });
    setTimeout(() => {
      this.setState({ countDown3: [] })
    }, 500);
  }

  start2 = () => {
      this.setState({ countDown2: ['countDown2 countDownStartHide'] });
    setTimeout(() => {
      this.setState({ countDown2: [] })
    }, 500);
  }

  start1 = () => {
      this.setState({ countDown1: ['countDown1 countDownStartHide'] });
    setTimeout(() => {
      this.setState({ countDown1: [] })
    }, 500);
  }

  realStart = () => {
      this.setState({ gameStartNotice: ['gameStartNotice startHide'] });
    setTimeout(() => {
      this.setState({ gameStartNotice: [] })
    }, 2000);
  }

  correctAnswerNotice = () => {
    const returnArr = [];
    this.state.correctAnswerNotice.forEach((e) => {
      returnArr.push(<div className={e.classname}
                          key={uuid()}>
                      Correct Answer! <br/>
                      {e.name} <br/>got points!</div>)
    });
    return returnArr;
  };

  yourTurnNotice = () => {
    const returnArr = [];
    this.state.turnNotice.forEach((e) => {
      returnArr.push(<div className={e} key={uuid()}>Your Turn!</div>)
    });
    return returnArr;
  };

  /**
   * Tool Related
   */

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false })
    const formerKey = (this.state.weightPick - 3) / 5 + 1
    this.weightPicker(null, formerKey);
  };

  handleChange = (color) => {
    this.setState({
      color: color.rgb,
      eraser: false
    })
  };

  weightPicker = (e, formerKey) => {
    for(const key in this.weightTool) {
      if (key == (e === null ? formerKey : e.target.id.slice(-1))) {
        this.setState({ weightPick: 3 + (key - 1) * 5 });
        setTimeout(() => {
          this.weightTool[key].className = 'weights shadowOut selected';
        },0)
      } else {
        setTimeout(() => {
          this.weightTool[key].className = 'weights shadowOut';
        },0)
      }
    }
  }

  weightToolRender = () => {
    const returnArr = []
    const style = { background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`};
    for(let i = 1; i < 5; i++) {
      if (i === 1) {
      returnArr.push(<div className="weights shadowOut selected"
                          ref={(e) => this.weightTool[i] = e}
                          onClick={this.weightPicker}
                          id={"weightTypesWrapper" + i} key={uuid()}>
                       <div id={"weightTypes" + i} style={style}></div>
                     </div>);
      } else {
        returnArr.push(<div className="weights shadowOut"
                            ref={(e) => this.weightTool[i] = e}
                            onClick={this.weightPicker}
                            id={"weightTypesWrapper" + i} key={uuid()}>
                         <div id={"weightTypes" + i} style={style}></div>
                       </div>);
      }
    }
    return returnArr;
  }

  clearAllDrawings = () => {
    // clear canvas
    this.setState({ eraser: false });
    if (this.props.turnInfo.id === this.props.user[0].id) strokeClear(this.props.roomkey)
  }

  undo = (e) => {
    if (this.props.turnInfo.id === this.props.user[0].id) undoRecent(this.props.roomkey)
  }

  eraser = (e) => {
    this.setState({ eraser: !this.state.eraser });
  }

  cancelEraser = (e) => {
    this.setState({ eraser: false });
    this.cursor.style.cursor = "url(../../../img/pencil.png) 0 16, auto";
  }


  render() {

    const styles = reactCSS({
      'default': {
        color: {
          width: '36px',
          height: '14px',
          borderRadius: '2px',
          background: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
        },
        swatch: {
          padding: '5px',
          background: '#fff',
          borderRadius: '1px',
          boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
          display: 'inline-block',
          cursor: 'pointer',
        },
        popover: {
          position: 'absolute',
          zIndex: '2',
        },
        cover: {
          position: 'fixed',
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px',
        },
        pencilLogo: {
          color: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`
        }
      },
    });

    return (
      <div className="canvasSectionWrapper">
        {/* Left SideBar */}
        <div className="sidebars">
          <div className="toolWrapper1 shadowOut">
            {/* Color Picker Tool */}
            <div className="colorPickerWrapper">
              Color Picker
              <div className="colorPicker">
                <i className="fa fa-pencil-square fa-lg shadowOut"
                   style={ styles.pencilLogo }></i>
                <div className="colorPickerPallet shadowOut">
                  <div style={ styles.swatch } onClick={ this.handleClick }>
                    <div style={ styles.color }></div>
                  </div>
                  { this.state.displayColorPicker ? (
                    <div style={ styles.popover }>
                      <div style={ styles.cover } onClick={ this.handleClose }></div>
                      <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
                    </div>) : null }
                </div>
              </div>
            </div>
            {/* Line Weights Tool */}
            <div className="lineWeightsWrapper">
              Line Weights
              <div className="lineWeights">
                {this.weightToolRender()}
              </div>
            </div>
            {/* Edit Tool */}
            <div className="editToolWrapper">
              Edit Tool
              <div className="editTool">
                <div className="clearBtn shadowOut"
                     onClick={this.clearAllDrawings}>CLEAR</div>
                <div className="weights shadowOut edits">
                  <i className="fa fa-undo fa-lg" aria-hidden="true"
                     onClick={this.undo}></i>
                </div>
                <div className={this.state.eraser ? "weights shadowOut selected" : "weights shadowOut"}
                     key={uuid()}>
                  <i className="fa fa-eraser fa-lg"
                     aria-hidden="true"
                     onClick={this.eraser}></i>
                </div>
              </div>
            </div>
          </div>
          <div className="toolWrapper2"></div>
        </div>
        {/* Center */}
        <div className="canvasWrapper shadowOut">
          {this.countDown3()}
          {this.countDown2()}
          {this.countDown1()}
          {this.gameStartNotice()}
          {this.correctAnswerNotice()}
          {this.yourTurnNotice()}
          <canvas id="whiteBoard"></canvas>
          <ChatInput/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      roomkey: state.room,
      gameStartInfo: state.gameStart,
      turnInfo: state.currentTurn
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    gameStart: (checker) => {
      dispatch(updateGameStart(checker))
    },
    currentTurn: (index) => {
      dispatch(updateCurrentTurn(index))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
