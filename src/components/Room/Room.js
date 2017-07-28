import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         triggerUpdatingGameStart,
         currentWordGenerating } from '../../firebase';
import firebase from '../../firebase';

import './Room.css';

// Import Actions
import { updateGameStart } from '../../actions/gameActions';
import { updateCurrentTurn } from '../../actions/turnActions';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';
import ChatInput from './ChatInput/ChatInput';

export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.startingNotice = null;
    this.state = {
      msg: '',
      chatInput: '',
      ready: false,
      memberKey: '',
      topic: '',
      currentPlayerId: '',
      currentPlayerTurn: '',
      currentTurnIndex: '',
      currentWord: ''
    }
  }

  componentDidMount() {

    // Get member Key and room Topic
    firebase.database().ref('/rooms/' + this.props.roomkey)
      .once('value')
      .then((snapshot) => {
        const room = snapshot.val();
        const members = room.members;
        for(const key in members) {
          if (members[key].id === this.props.user[0].id) {
            this.setState({
              memberKey: key,
              topic: room.roomTopic
            });
          }
        }
      });

    // Get gameStart status - game start!
    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    readyRef.on('value', (data) => {
      // Game Start! update to redux
      this.props.gameStart(data.val())
      // currentWord Generation requesting
      if (this.state.topic) {
        console.log('enter')
        currentWordGenerating(this.props.roomkey, this.state.memberKey, this.state.topic, this.props.turnInfo);
      }
    });

    // Listener for current turn change
    const turnRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnRef.on('value', (snapshot) => {
      const nextTurn = snapshot.val();
      firebase.database().ref('rooms/' + this.props.roomkey + '/members')
      .once('value', (snapshot) => {
        const members = snapshot.val();
        const keyArray = [];
        for (const key in members) {
          keyArray.push(members[key]);
        }
        this.setState({
          currentPlayerTurn: keyArray[nextTurn].username || keyArray[nextTurn].displayName,
          currentPlayerId: keyArray[nextTurn].id,
          currentTurnIndex: nextTurn
        });
        this.props.currentTurn(nextTurn);
      });
    }); // turnRef.on Ends.

    // Get Cur Word.
    const wordRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentWord');
    wordRef.on('value', (snapshot) => {
      this.setState({ currentWord: snapshot.val() })
    });

  } // componentDidMount Ends.

  componentWillReceiveProps() {

  }

  componentDidUpdate() {

  }

  /**
   * Room related.
   */
  leaveRoom = () => {
    roomMemberUpdating(this.props.roomkey, this.state.memberKey, {}, true, '/lobby');
  }

  /**
   * GameLogic related
   */
  gameReady = () => {
    this.setState({ ready: true });
    // Updating ready status of mine.
    readyUpdating(this.props.roomkey, this.state.memberKey, true);
    // Checking ready status of all members
    triggerUpdatingGameStart(this.props.roomkey);
  }

  checkTurn = () => {
    return this.state.currentPlayerId === this.props.user[0].id ? true : false;
  }

  readyBtnDisplay = () => {
    if (this.state.ready) {
      return (
      <button type="button"
              className="btn btn-primary disabled"
              onClick={this.gameReady}
              key={uuid()}>
              Waiting Others</button>
    )} else { return (
      <button type="button"
              className="btn btn-primary"
              onClick={this.gameReady}
              key={uuid()}>
              Game Ready</button>
    )}
  }

  gameStartNotice = () => {

    setTimeout(() => {
      this.startingNotice.style.display = 'none';
    }, 2300)

    return (<div className="gameStartNotice startHide"
                 ref={(e) => this.startingNotice = e}>GAME START!</div>)
  };

  skipTurn = () => {
    const roomRef = firebase.database().ref('rooms/' + this.props.roomkey);
    roomRef.once('value', (snapshot) => {
        const memberCount = snapshot.val().memberCount;
        let currentTurn = snapshot.val().currentTurn;
        let nextTurn = currentTurn < memberCount - 1 ? currentTurn + 1 : 0;
        firebase.database().ref('rooms/' + this.props.roomkey).update({
          'currentTurn': nextTurn
        });
      })
  };

  readyBtnDisplay = () => {
    if (this.state.ready) {
      return (
        <button type="button"
                className="btn btn-primary disabled"
                onClick={this.gameReady}
                id="waitingBtn">
                Waiting ...</button>
    )} else {
      return (
        <button type="button"
                className="btn btn-primary"
                onClick={this.gameReady}
                id="gameReadyBtn">
                Ready</button>
    )}
  };



  render() {
    const isItYourTurn = this.checkTurn();
    return (
      <div className="container-fluid contentBody">
        <div className="row roomContent">
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
          <div className="col-lg-8 col-md-12 sectionDivider">
            <div className="" id="mainContentWrapper">
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
              {/* Right SideBar */}
              <div className="sidebars">
                <div className="sideRow">
                  <button type="button"
                          className="btn btn-primary"
                          id="leaveRoomBtn"
                          onClick={this.leaveRoom}>
                          Leave Room</button>
                </div>
                <div className="sideRow">
                  {this.props.gameStartInfo ? null : this.readyBtnDisplay()}
                </div>
              {this.props.gameStartInfo ? isItYourTurn ? (
                <div className="sideRow turnWrapper">
                  <div className="sideRow">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                    </div>
                  </div>
                  <div className="sideRow">
                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-primary"
                              onClick={this.skipTurn}>Skip Turn</button>
                    </div>
                  </div>
                  <div className="sideRow">
                    <div className="curWordWrapper shadowOut">
                      <div className="curWordTitle">Current Word</div>
                      <div className="curWord">{this.state.currentWord}</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sideRow turnWrapper">
                  <div className="sideRow">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                    </div>
                  </div>
                  <div className="sideRow">
                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-primary disabled">not your turn</button>
                    </div>
                  </div>
                </div>
              ) : null}
              </div> {/* Sidebar End */}
            </div> {/* mainContentWrapper End */}
            <UserlistChat/>
          </div>
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
        </div>
      </div>
    );
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

export default connect(mapStateToProps, mapDispatchToProps)(Room);
