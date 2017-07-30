import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         triggerUpdatingGameStart,
         currentWordGenerating,
         turnChangingLogic,
         strokeClear } from '../../firebase';
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
        currentWordGenerating(this.props.roomkey, this.state.memberKey, this.state.topic);
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
          currentPlayerId: keyArray[nextTurn].id
        });
        const updator = {
          index: nextTurn,
          id: keyArray[nextTurn].id,
          name: keyArray[nextTurn].username || keyArray[nextTurn].displayName
        }
        this.props.currentTurn(updator);
      });
    }); // turnRef.on Ends.

    /* Temporal Logic, if the host left the room, turn will be changed */
    const membersRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');
    membersRef.on('child_removed', (data) => {
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
            currentPlayerId: keyArray[nextTurn].id
          });
          const updator = {
            index: nextTurn,
            id: keyArray[nextTurn].id,
            name: keyArray[nextTurn].username || keyArray[nextTurn].displayName
          }
          this.props.currentTurn(updator);
        });
      }); 
    });


    // Get Cur Word.
    const wordRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentWord');
    wordRef.on('value', (snapshot) => {
      this.setState({ currentWord: snapshot.val() })
    });
    console.log(this.props.turnInfo.index);
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
    currentWordGenerating(this.props.roomkey, this.state.memberKey, this.state.topic)
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
              <Canvas/>
              {/* Right SideBar */}
              <div className="sidebars">
                <div className="sideRow">
                  <button type="button"
                          className="btn btn-primary"
                          id="leaveRoomBtn"
                          onClick={this.leaveRoom}>
                          Leave Room</button>
                  <div className="readyWrapper">
                    {this.props.gameStartInfo ? null : this.readyBtnDisplay()}
                  </div>
                </div>
              {this.props.gameStartInfo ? isItYourTurn ? (
                <div className="sideRow turnWrapper">
                  <div className="">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
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
                </div>
              ) : (
                <div className="sideRow turnWrapper">
                  <div className="">
                    <div className="turnDiv shadowOut">
                      <p className="playerTurn">
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-primary disabled">not your turn</button>
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
