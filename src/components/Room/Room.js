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
import { updateTimerStatus } from '../../actions/timerActions';
import { updateLobby } from '../../actions/lobbyActions';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';
import Canvas from './Canvas/Canvas';

// Import UI
import RaisedButton from 'material-ui/RaisedButton';

export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      roomName: '',
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
      gameoverChk: false,
      time: {},
      seconds: 90,
      timer: 0,
      startTheTimer: false,
      winnerList: []
    }
  }

  componentDidMount() {
    this.props.updateLobby('room');
    // Get Room name from firebase and store it in react state
      const roomNameRef = firebase.database().ref('rooms/' + this.props.roomkey + '/roomName');
      roomNameRef.once('value', (snapshot) => {
        if(snapshot.val()) {
          const roomName = snapshot.val();
          this.setState({ roomName: roomName });
        }
      })

    // Get member Key and room Topic
    firebase.database().ref('/rooms/' + this.props.roomkey)
      .once('value')
      .then((snapshot) => {
        //if (snapshot.val()) {
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
      // Start the timer when the game starts
      if((data.val() && !this.props.timer) || (data.val() && this.props.timer === false)) {
          this.setState({
            time: this.secondsToTime(90),
            seconds: 90,
            startTheTimer: true
          })
          this.props.updateTimer(true);
          this.startTimer();
      }
    });

    // Get gameover
    const gameoverRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameover');
    gameoverRef.on('value', (data) => {
      this.setState({ gameover: data.val() })
      if (data.val()) {
        this.setState({ gameoverChk: true });
        this.props.updateTimer(false);
        this.resetTimer();
        // set gameStart to false --> Alex, we can do this in the updatingGameStart function in firebase.js
        firebase.database().ref('rooms/' + this.props.roomkey).update({ gameStart: false });
        firebase.database().ref('rooms/' + this.props.roomkey + '/message').set({});
      }
      firebase.database().ref('rooms/' + this.props.roomkey + '/members')
        .once('value')
        .then((snapshot) => {
          if (snapshot.val()) {
            const members = snapshot.val();
            const cache = {
              'topscore': 0,
              'users': []
            }
            for (const key in members) {
              if( members[key].score >= cache.topscore) {
                cache.topscore = members[key].score;
              }
            }
            for (const key in members) {
              if ( members[key].score === cache.topscore) {
                cache.users.push(<div className="winners"
                                      key={uuid()}>
                                      {members[key].displayName}
                                      <i className="fa fa-trophy fa-2x" aria-hidden="true"></i>
                                      {members[key].score}
                                      </div>)
              }
            }
            this.setState({ winnerList: cache.users })
          }
        });
    });

    // Listener for current turn change
    const turnRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnRef.on('value', (snapshot) => {
      if(this.props.timer) {
        // reset the timer and start it again when turn changes
        this.setState({
          time: this.secondsToTime(90),
          seconds: 90,
          startTheTimer: true
        })
        clearInterval(this.state.timer);
        if(this.state.seconds === 90) this.startTimer();
        // end of timer
      }
      if (!this.state.gameover) {

      const nextTurn = snapshot.val();
      firebase.database().ref('rooms/' + this.props.roomkey + '/members')
        .once('value', (snapshot) => {
            if (snapshot.val()) {
              const members = snapshot.val();
              const keyArray = [];
              for (const key in members) {
                keyArray.push(members[key]);
              }
              if(!(nextTurn > keyArray.length)) {
                this.setState({
                  currentPlayerTurn: keyArray[nextTurn].displayName,
                  currentPlayerId: keyArray[nextTurn].id
                });
                const updatorIfMoreThanOne = {
                  index: nextTurn,
                  id: keyArray[nextTurn].id,
                  name: keyArray[nextTurn].displayName,
                  stage: this.state.currentStage
                }
                this.props.currentTurn(updatorIfMoreThanOne);
              } else {
                this.setState({
                  currentPlayerTurn: this.props.user[0].displayName,
                  currentPlayerId: this.props.user[0].id
                })
                let nextTurnForOne = nextTurn;
                if(nextTurnForOne > 0) nextTurnForOne -= 1
                else nextTurnForOne = 0
                const updatorIfOnlyOne = {
                  index: nextTurnForOne,
                  id: this.props.user[0].id,
                  name: this.props.user[0].displayName,
                  stage: this.state.currentStage
                }
                this.props.currentTurn(updatorIfOnlyOne);
              }
            } // If snapshot.val() ends
          });
        } // If !this.state.gameover ends.
      }); // turnRef.on Ends.

      /* Temporal Logic, if the host left the room, turn will be changed */
      const membersRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');
      membersRef.on('child_removed', (data) => {
      turnRef.on('value', (snapshot) => {
        if (!this.state.gameover) {
          const nextTurn = snapshot.val();
          firebase.database().ref('rooms/' + this.props.roomkey + '/members')
          .once('value', (snapshot) => {
            if (snapshot.val()) {
              const members = snapshot.val();
              const keyArray = [];
              for (const key in members) {
                keyArray.push(members[key]);
              }
              if (keyArray.length > 1) {
                this.setState({
                  currentPlayerTurn: keyArray[nextTurn].displayName,
                  currentPlayerId: keyArray[nextTurn].id
                });
              }
              const updator = {
                index: nextTurn,
                id: keyArray[nextTurn].id,
                name: keyArray[nextTurn].displayName
              }
              this.props.currentTurn(updator);
            } // if (snapshot.val()) ends
          });
        } // if (!this.state.gameover) ends
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

  /**
   * Room related.
   */
  leaveRoom = () => {
    // clear canvas
    if(this.props.user[0].id === this.props.turnInfo.id) strokeClear(this.props.roomkey)
    // updating to firebase
    roomMemberUpdating(this.props.roomkey, this.state.memberKey, {}, true, '/lobby');
    this.props.updateTimer(null);
  }

  playAgain = () => {
    this.setState({
      ready: false,
      gameoverChk: false,
      currentStage: 0
    });
    allMemeberReadyUpdating(this.props.roomkey);
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

  skipTurn = () => {
    // clear canvas
    strokeClear(this.props.roomkey)
    // Turn Changing.
    turnChangingLogic(this.props.roomkey);
    // currentWord Generation requesting
    currentWordGenerating(this.props.roomkey, this.props.user[0].id, this.state.topic, false)
    // Stage Updater needed!
  };

  /*
   * Time Remaining Functions
  */
  secondsToTime = (secs) => {
    let convertToMinutes = secs % (60 * 60);
    let minutes = Math.floor(convertToMinutes / 60);

    let convertToSeconds = (convertToMinutes % 60);
    let seconds = Math.ceil(convertToSeconds);

    if (seconds === 0) seconds = "00";

    let obj = {
      "minutes": minutes,
      "seconds": seconds
    }
    return obj;
  }

  startTimer = () => {
    if(this.state.startTheTimer) {
      let timer = setInterval(this.countDown, 1000);
      this.setState({
        timer: timer
      })
    }
  }

  countDown = () => {
    // Remove one second, set state so a re-render happens.
      let seconds = (this.state.seconds - 1);
      this.setState({
        time: this.secondsToTime(seconds),
        seconds: seconds  // keeps track of the countdown
      })
        // Check if we're at zero.
      if (seconds <= 0 && this.props.turnInfo.id === this.props.user[0].id) {
        this.resetTimer();
        this.skipTurn();
      }
      if (seconds <= 0 && this.props.turnInfo.id !== this.props.user[0].id) {
        clearInterval(this.state.timer);
        this.setState({
          time: this.secondsToTime(90),
          seconds: 90
        })
      }
  }

  resetTimer = () => {
    clearInterval(this.state.timer);
    firebase.database().ref('rooms/' + this.props.roomkey).update({ startTimer: false });
  }

/***********************************
** End of time remaining functions *
*///////////////////////////////////



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
                <Canvas gameReady={this.gameReady}
                        ready={this.state.ready}
                        currentPlayerId={this.state.currentPlayerId}
                        gameover={this.state.gameover}
                        gameoverChk={this.state.gameoverChk}
                        currentWord={this.state.currentWord}
                        currentStage={this.state.currentStage}
                        currentPlayerTurn={this.state.currentPlayerTurn}
                        skipTurn={this.skipTurn}/>
              )}

              {/* Right SideBar */}
              <div className="sidebars">
                <div className="sideRow">
                <div className="roomInfoDiv">
                  <div className="roomNameDiv">
                   Room Name
                   <br/>
                    {this.state.roomName}
                  </div>
                  <div className="stageDiv">
                   Stage
                   <br/>
                    {this.state.currentStage ? this.state.currentStage : 0} / 6
                  </div>
                  <div className="roomTopicDiv">
                    Room Topic
                    <br/>
                    {this.state.topic}
                  </div>
                </div>
                </div>
                <div className="sideRow underSideRow">
                {this.props.gameStartInfo && (!this.state.gameover || !this.state.gameoverChk) ? (
                  <div className="turnWrapper">
                    <div className="timerDiv">
                      <h5 className="timeRemainingText"> Timer </h5>
                      <div className="timeDisplay"> {this.state.time.minutes} : {this.state.time.seconds} </div>
                    </div>
                  </div>
                ) : null}
                {this.state.gameover || this.state.gameoverChk ? null : (
                  <div>
                  <RaisedButton label="Leave" primary={true}
                                className="leaveRoomBtn"
                                onTouchTap={this.leaveRoom}/>
                  </div>
                )}
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
            <div>{this.state.winnerList}</div>
            <div className="gameOverSubtitle">Congratulations!</div>
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
      turnInfo: state.currentTurn,
      timer: state.timerStatus
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    gameStart: (checker) => {
      dispatch(updateGameStart(checker))
    },
    currentTurn: (index) => {
      dispatch(updateCurrentTurn(index))
    },
    updateTimer: (timerStatus) => {
      dispatch(updateTimerStatus(timerStatus))
    },
    updateLobby: (status) => {
      dispatch(updateLobby(status))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
