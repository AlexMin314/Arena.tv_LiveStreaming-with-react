import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         allMemeberReadyUpdating,
         triggerUpdatingGameStart,
         currentWordGenerating,
         turnChangingLogic,
         strokeClear,
         gameOverUpdator } from '../../firebase';
import firebase from '../../firebase';

import './Room.css';

// Import Actions
import { updateGameStart } from '../../actions/gameActions';
import { updateCurrentTurn } from '../../actions/turnActions';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';
import Canvas from './Canvas/Canvas';

export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      msg: '',
      chatInput: '',
      ready: false,
      memberKey: '',
      topic: '',
      currentPlayerId: '',
      currentPlayerTurn: '',
      currentWord: '',
      currentStage: '',
      gameover: false,
      gameoverChk: false
    }
  }

  componentDidMount() {

    // Get member Key and room Topic
    firebase.database().ref('/rooms/' + this.props.roomkey)
      .once('value')
      .then((snapshot) => {
        //if (snapshot.val()) {
          const room = snapshot.val();
          const members = room.members;
          for(const key in members) {
            if (members[key].id === this.props.user[0].id) {
              console.log()
              this.setState({
                memberKey: key,
                topic: room.roomTopic
              });
            }
          }
        //}
      });

    // Get gameStart status - game start!
    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    readyRef.on('value', (data) => {
      // Game Start! update to redux
      this.props.gameStart(data.val())
      // currentWord Generation requesting
      if (this.state.topic) {
        currentWordGenerating(this.props.roomkey, this.props.user[0].id, this.state.topic, true);
      }
    });

    // Get gameover
    const gameoverRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameover');
    gameoverRef.on('value', (data) => {
      this.setState({ gameover: data.val() })
      if (data.val()) {
        this.setState({ gameoverChk: true });
      }
    });

    // Listener for current turn change
    const turnRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnRef.on('value', (snapshot) => {
      if (!this.state.gameover) {
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
            currentPlayerId: keyArray[nextTurn].id
          });
          const updator = {
            index: nextTurn,
            id: keyArray[nextTurn].id,
            name: keyArray[nextTurn].username || keyArray[nextTurn].displayName,
            stage: this.state.currentStage
          }
          this.props.currentTurn(updator);
        });
      }
    }); // turnRef.on Ends.

    /* Temporal Logic, if the host left the room, turn will be changed */
    const membersRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');
    membersRef.on('child_removed', (data) => {
      turnRef.on('value', (snapshot) => {
        if (!this.state.gameover) {
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
              currentPlayerId: keyArray[nextTurn].id
            });
            const updator = {
              index: nextTurn,
              id: keyArray[nextTurn].id,
              name: keyArray[nextTurn].username || keyArray[nextTurn].displayName
            }
            this.props.currentTurn(updator);
          });
        }
      });
    });


    // Get Cur Word.
    const wordRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentWord');
    wordRef.on('value', (snapshot) => {
      this.setState({ currentWord: snapshot.val() })
    });

    const stageRef = firebase.database().ref('rooms/' + this.props.roomkey + '/stages');
    stageRef.on('value', (snapshot) => {
      this.setState({ currentStage: snapshot.val() })
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
    // clear canvas
    if(this.props.user[0].id === this.props.turnInfo.id) {
      strokeClear(this.props.roomkey)
    }
    // updating to firebase
    roomMemberUpdating(this.props.roomkey, this.state.memberKey, {}, true, '/lobby');
  }

  playAgain = () => {
    this.setState({ ready: false });
    this.setState({ gameoverChk: false });
    allMemeberReadyUpdating(this.props.roomkey);
    triggerUpdatingGameStart(this.props.roomkey);
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

  skipTurn = () => {
    // clear canvas
    strokeClear(this.props.roomkey)
    // Turn Changing.
    turnChangingLogic(this.props.roomkey);
    // currentWord Generation requesting
    currentWordGenerating(this.props.roomkey, this.props.user[0].id, this.state.topic)
    // Stage Updater needed!
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
              {/* Left SideBar + Center Canvas*/}
              {this.state.gameover || this.state.gameoverChk ? null : (
                <Canvas/>
              )}
              {/* Right SideBar */}
              <div className="sidebars">
                <div className="sideRow">
                  {this.state.gameover || this.state.gameoverChk ? null : (
                    <div>
                      <button type="button"
                              className="btn btn-primary"
                              id="leaveRoomBtn"
                              onClick={this.leaveRoom}>
                              Leave</button>
                    </div>
                  )}
                  <div className="readyWrapper">
                    {this.props.gameStartInfo ? null : this.readyBtnDisplay()}
                  </div>
                </div>
              {this.props.gameStartInfo && (!this.state.gameover || !this.state.gameoverChk) ? isItYourTurn ? (
                <div className="sideRow turnWrapper">
                  <div className="">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
                        Stage: {this.state.currentStage}
                        <br/>
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-primary"
                              onClick={this.skipTurn}>Skip Turn</button>
                    </div>
                  </div>
                  <div className="">
                    <div className="curWordWrapper shadowOut">
                      <div className="curWordTitle">Current Word</div>
                      <div className="curWord">{this.state.currentWord}</div>
                    </div>
                  </div>
                  <div className="">
                    <div className="timerDiv">
                      <h2> Timer countdown </h2>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="sideRow turnWrapper">
                  <div className="">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
                        Stage: {this.state.currentStage}
                        <br/>
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-primary disabled">It is not your turn</button>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="sideRow">
              </div>
              </div> {/* Sidebar End */}
            </div> {/* mainContentWrapper End */}
            <UserlistChat topic={this.state.topic}
                          memberKey={this.state.memberKey}/>
          </div>
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
        </div>
        {this.state.gameover || this.state.gameoverChk ? (
          <div className="gameOverWapper">
            <div className="gameOver">GAME OVER!</div>
            <div>Information</div>
            <div>Information</div>
            <div>Information</div>
            <div>Information</div>
            <div>Information</div>
            <div className="gameOverBtns">
              <button type="button"
                      className="btn btn-primary"
                      id="playAgain"
                      onClick={this.playAgain}>
                      Play<br/>Again</button>
              <button type="button"
                      className="btn btn-primary"
                      id="returnLobby"
                      onClick={this.leaveRoom}>
                      Return to<br/>lobby</button>
            </div>
          </div>
        ) : null}
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
