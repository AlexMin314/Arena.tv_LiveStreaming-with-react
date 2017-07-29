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

    this.startingNotice = null;
    this.state = {

    }
  }

  componentDidMount() {

  } // componentDidMount Ends.

  componentWillReceiveProps() {

  }

  componentDidUpdate() {

  }

  gameStartNotice = () => {

    setTimeout(() => {
      this.startingNotice.style.display = 'none';
    }, 2300)

    return (<div className="gameStartNotice startHide"
                 ref={(e) => this.startingNotice = e}>GAME START!</div>)
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
          {this.props.gameStartInfo ? this.gameStartNotice() : null}
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
