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
         strokeUpdator } from '../../../firebase';
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

    this.state = {
      gameStartNotice: [],
      correctAnswerNotice: [],
      turnNotice: [],
      displayColorPicker: false,
      color: {
        r: '0',
        g: '0',
        b: '0',
        a: '100',
      },
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
        setTimeout(() => this.setState({ correctAnswerNotice: [] }), 2000)
      }
    })
    const startRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    startRef.on('value', (data) => {
      if(data.val() && newItems) {
        this.setState({ gameStartNotice: ['gameStartNotice startHide'] });
        setTimeout(() => this.setState({ gameStartNotice: [] }), 2000)
      }
    })
    const turnNoticeRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnNoticeRef.on('value', (data) => {
      if (newItems) {
        setTimeout(() => {
          if(this.props.user[0].id === this.props.turnInfo.id) {
            this.setState({ turnNotice: ['turnNoticeText startHide'] });
            setTimeout(() => this.setState({ turnNotice: [] }), 2000)
          }
        }, 300)
      }
    })

    startRef.once('value', (data) => {
      if(data.val()) {
        winnerRef.once('value', (data) => {
          turnNoticeRef.once('value', (data) => {
            newItems = true;
          })
        })
      }
    })

    /**
    * Event Listener of mouse
    */
    const canvas = document.getElementById('whiteBoard');
    const ctx = canvas.getContext("2d");
    // getting local settings
    let cRect = canvas.getBoundingClientRect();
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let aspect = width / height;
    let resizeCanvas;
    canvas.height = height;
    canvas.width = width;


    // Temporal tool settings.
    let drawing = false;
    let lineJoin = "round";
    let lineWidth = 5;

    // Rendering Logic
    const redraw = () => {

      // getting tool settings
      ctx.strokeStyle = `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`;
      ctx.lineJoin = lineJoin;
      ctx.lineWidth = lineWidth;
      // getting the latest element from the this.drawings array.
      const curIdx = this.drawings.length - 1;
      const pastIdx = this.drawings.length - 2;
      const arr = this.drawings;

      ctx.beginPath();
      // condition for clicking(just dot) or dragging(line)
      if (arr.length > 1 && arr[pastIdx].mv === 'drag') {
        ctx.moveTo(arr[pastIdx].mX * width, arr[pastIdx].mY * height)
      }
      if(arr[curIdx].mv === ('start' || 'end')) {
        ctx.moveTo(arr[curIdx].mX * width - 1, arr[curIdx].mY * height)
      }
      ctx.lineTo(arr[curIdx].mX * width, arr[curIdx].mY * height);
      ctx.closePath();
      ctx.stroke();
    }

    // helper function for caculating mouse coordinate.
    const coordinator = (e, move, aspect) => {
      const cRect = canvas.getBoundingClientRect();
      const mX = (e.clientX - cRect.left) / width;
      const mY = (e.clientY - cRect.top) / height;
      const mv = move;
      const ap = aspect;
      return { mX, mY, mv, ap }
    }


    // Event Listners.
    const uid = this.props.user[0].id;
    canvas.addEventListener('mousedown', (e) => {
      const mouseXY = coordinator(e, 'start', aspect);
      if (this.props.gameStartInfo && this.props.turnInfo.id === uid) {
        strokeUpdator(this.props.roomkey, mouseXY);
        drawing = true;
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      if(drawing && this.props.gameStartInfo && this.props.turnInfo.id === uid) {
        const mouseXY = coordinator(e, 'drag', aspect);
        strokeUpdator(this.props.roomkey, mouseXY, this.props.gameStartInfo);
      }
    });
    canvas.addEventListener('mouseup', (e) => {
      const mouseXY = coordinator(e, 'end', aspect);
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
    })

    // Resize canvas and Rerender drawings if user resize the window.
    window.addEventListener('resize', () => {
      clearTimeout(resizeCanvas);
      // setTimeout for optimazation on performance.
      resizeCanvas = setTimeout(() => {
        // updating local settings.
        cRect = canvas.getBoundingClientRect();
        width = canvas.clientWidth;
        height = canvas.clientHeight;
        aspect = width / height;
        canvas.width = width;
        canvas.height = height;
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

  componentWillReceiveProps() {

  }

  componentWillUpdate() {

  }

  componentDidUpdate() {

  }

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
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb })
  };


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
          <div className="toolWrapper">
            Color Picker
            <div className="colorPickerWrapper">
              <i className="fa fa-pencil-square fa-lg" style={ styles.pencilLogo } ></i>
              <div className="colorPicker">
                <div style={ styles.swatch } onClick={ this.handleClick }>
                  <div style={ styles.color } />
                </div>
                { this.state.displayColorPicker ? <div style={ styles.popover }>
                  <div style={ styles.cover } onClick={ this.handleClose }/>
                  <SketchPicker color={ this.state.color } onChange={ this.handleChange } />
                </div> : null }
              </div>
            </div>
            <div className="ereaser"></div>
            <div className="clearBtn"></div>
          </div>
          <div className="toolWrapper">
            <div className="strokeStyle"></div>
            <div className="strokeStyle"></div>
            <div className="strokeStyle"></div>
            <div className="strokewidth"></div>
            <div className="strokewidth"></div>
            <div className="strokewidth"></div>
            <div className="strokewidth"></div>
          </div>
          <div className="toolWrapper"></div>
        </div>
        {/* Center */}
        <div className="canvasWrapper shadowOut">
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
