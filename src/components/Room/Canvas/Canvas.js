import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         triggerUpdatingGameStart,
         currentWordGenerating,
         turnChangingLogic } from '../../../firebase';
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

    this.state = {
      gameStartNotice: [],
      correctAnswerNotice: [],
      drawings: []
    }
  }

  componentDidMount() {

    /* Need a logic for preventing rerender whan user reload by redux and stage, turnNum */
    const winnerRef = firebase.database().ref('rooms/' + this.props.roomkey + '/winnerOfStage');
    winnerRef.on('child_added', (data) => {
      if(data.val() !== 'init') {
        this.setState({
          correctAnswerNotice : [{classname:'correctAnswerNotice startHide',
                                    name:data.val().name}]
        })
        setTimeout(() => this.setState({ correctAnswerNotice: [] }), 2000)
      }
    })
    const startRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    startRef.on('value', (data) => {
      if(data.val()) {
        this.setState({ gameStartNotice: ['gameStartNotice startHide'] });
        setTimeout(() => this.setState({ gameStartNotice: [] }), 2000)
      }
    })

    /**
    * Event Listener of mouse
    */
    const canvas = document.getElementById('whiteBoard');
    let cRect = canvas.getBoundingClientRect();
    let width = cRect.width;
    let height = cRect.height;
    canvas.width = width;
    canvas.height = height;
    window.addEventListener('resize', () => {

    })
    const ctx = canvas.getContext("2d");

    let drawing = false;
    let color = "black";
    let lineJoin = "round";
    let lineWidth = 5;
    let test = [];

    const coordinator = (e) => {
      const cRect = canvas.getBoundingClientRect();
      const mouseX = (e.clientX - cRect.left) / width;
      const mouseY = (e.clientY - cRect.top) / height;
      return { mouseX, mouseY }
    }

    canvas.addEventListener('mousedown', (e) => {
      const mouseXY = coordinator(e);
      test.push(mouseXY)
      redraw()
      drawing = true;
    })
    canvas.addEventListener('mousemove', (e) => {
      if(drawing) {
        const mouseXY = coordinator(e);
        test.push(mouseXY)
        redraw()
      }
    })
    canvas.addEventListener('mouseup', (e) => {
      const mouseXY = coordinator(e);
      test = [];
      drawing = false;
    })
    canvas.addEventListener('mouseleave', (e) => {
      test = [];
      drawing = false;
    })

    const redraw = () => {
      ctx.strokeStyle = color;
      ctx.lineJoin = lineJoin;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      if (test.length > 1) {
        ctx.moveTo(test[test.length - 2].mouseX * width, test[test.length - 2].mouseY * height)
      } else {
        ctx.moveTo((test[test.length - 1].mouseX) * width -1, (test[test.length - 1].mouseY) * height)
      }
        ctx.lineTo(test[test.length - 1].mouseX * width, test[test.length - 1].mouseY * height);
        ctx.closePath();
        ctx.stroke();
    }


  } // componentDidMount Ends.

  componentWillReceiveProps() {

  }

  componentWillUpdate() {

  }

  componentDidUpdate() {

  }

  gameStartNotice = () => {
    const returnArr = [];
    this.state.gameStartNotice.forEach((e) => {
      returnArr.push(<div className={e}>GAME START!</div>)
    });
    return returnArr;
  };

  correctAnswerNotice = () => {
    const returnArr = [];
    this.state.correctAnswerNotice.forEach((e) => {
      returnArr.push(<div className={e.classname}>
                      Correct Answer! <br/>
                      {e.name} <br/>got points!</div>)
    });
    return returnArr;
  };


  render() {
    return (
      <div className="canvasSectionWrapper">
        {/* Left SideBar */}
        <div className="sidebars">
          <div className="toolWrapper"></div>
          <div className="toolWrapper">
          </div>
          <div className="toolWrapper"></div>
        </div>
        {/* Center */}
        <div className="canvasWrapper shadowOut">
          {this.gameStartNotice()}
          {this.correctAnswerNotice()}
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
