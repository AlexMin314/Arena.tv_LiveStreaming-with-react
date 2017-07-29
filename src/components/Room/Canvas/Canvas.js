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
      correctAnswerNotice: []
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

  } // componentDidMount Ends.

  componentWillReceiveProps() {

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
