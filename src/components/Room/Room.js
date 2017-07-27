import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating,
         updatingGameStart } from '../../firebase';
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

    this.state = {
      msg: '',
      chatInput: '',
      ready: false,
      memberKey: '',
      currentPlayerId: '',
      currentPlayerTurn: ''
    }
  }

  componentDidMount() {
    /* Temporal Approach, can be changed into redux */
    // Get member Key
    firebase.database().ref('/rooms/' + this.props.roomkey + '/members')
      .once('value')
      .then((snapshot) => {
        const members = snapshot.val();
        for(const key in members) {
          if (members[key].id === this.props.user[0].id) {
            this.setState({ memberKey: key });
          }
        }
      });

    // Get gameStart status - game start!
    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    readyRef.on('value', (data) => {
      this.props.gameStart(data.val())

      if(data.val() === true) {
        firebase.database().ref('rooms/' + this.props.roomkey + '/members')
          .once('value')
          .then((snapshot) => {
            const members = snapshot.val();
            const membersArray = [];
            for (const key in members) {
              membersArray.push(members[key]);
            }
            this.props.currentTurn(membersArray[0].displayName || membersArray[0].username);
            this.setState({
              currentPlayerTurn: membersArray[0].displayName || membersArray[0].username,
              currentPlayerId: membersArray[0].id
            })
          })
      }
    })
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
    console.log(this.state.memberKey)
    readyUpdating(this.props.roomkey, this.state.memberKey, true);
    // Checking ready status of members
    firebase.database().ref('/rooms/' + this.props.roomkey + '/members')
      .once('value')
      .then((snapshot) => {
        const memberList = snapshot.val();
        let allReadyChecker = true;
        for (const key in memberList) {
          if (!memberList[key].ready) allReadyChecker = false;
        }
        // if all ready
        if(allReadyChecker) {
          updatingGameStart(this.props.roomkey, true);
        }
      })
  }


  checkTurn = () => {
    if(this.state.currentPlayerId === this.props.user[0].id) return true;
    return false;
  }

  skipTurn = () => {
    const roomRef = firebase.database().ref('rooms/' + this.props.roomkey);
    roomRef.on('value', (snapshot) => {
      const memberCount = snapshot.val().memberCount;
      let currentTurn = snapshot.val().currentTurn;
      let nextTurn;
      if(currentTurn < memberCount - 1) nextTurn = currentTurn + 1;
      else nextTurn = 0
        firebase.database().ref('rooms/' + this.props.roomkey).update({
          'currentTurn': nextTurn
        });
        firebase.database().ref('rooms/' + this.props.roomkey + '/members')
        .on('value', (snapshot) => {
          const members = snapshot.val();
          let keyArray = [];
          for (const key in members) {
            keyArray.push(members[key]);
          }
          this.setState({
            currentPlayerTurn: keyArray[nextTurn].displayName || keyArray[nextTurn].username,
            currentPlayerId: keyArray[nextTurn].id
          })
        })
      })
    }

    // firebase.database().ref('/rooms/' + this.props.roomkey + '/members')
    //   .once('value')
    //   .then((snapshot) => {
    //     const allCurrentPlayers = snapshot.val();
    //     const allPlayerIds = [];
    //     for (const key in allCurrentPlayers) {
    //       allPlayerIds.push(allCurrentPlayers[key].id);
    //     }
    //     const indexOfCurrentPlayer = allPlayerIds.indexOf(this.state.playerId) + 1;
    //     if (indexOfCurrentPlayer === allPlayerIds.length && allPlayerIds.length > 1) {
    //       this.setState({
    //         playerId: allPlayerIds[0]
    //       })
    //     }
    //     else {
    //       this.setState({
    //         playerId: allPlayerIds[indexOfCurrentPlayer]
    //       })
    //     }
    //   })


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

  render() {
    const isItYourTurn = this.checkTurn();
    return (
      <div className="container-fluid contentBody">
        <div className="row roomContent">
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
          <div className="col-lg-8 col-md-12 sectionDivider">
            <div className="" id="mainContentWrapper">
              <div className="sidebars"></div>
              <div className="canvasWrapper shadowOut">
              </div>

              <div className="sidebars">
                <div className="sideRow">
                  <button type="button"
                          className="btn btn-primary"
                          onClick={this.leaveRoom}>
                          Leave Room</button>
                  {this.props.gameStartInfo ? isItYourTurn ? (
                    <div className="turnContainer">
                      <div className="turnDiv">
                      <p className="playerTurn">
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                      </div>

                      <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-danger"
                              onClick={this.skipTurn}>Skip Turn</button>
                      </div>
                    </div>
                  ) : (
                    <div className="turnContainer">
                      <div className="turnDiv">
                      <p className="playerTurn">
                        Current Turn:
                        <br/>
                        {this.state.currentPlayerTurn}
                      </p>
                      </div>

                    <div className="skipTurnDiv">
                      <button type="button"
                              className="btn btn-danger disabled">It is not your turn</button>
                    </div>

                    </div>
                  ) : null}
                </div>
                <div className="sideRow">
                  {this.props.gameStartInfo ? null : this.readyBtnDisplay()}
                </div>
              </div>
            </div>
            <UserlistChat/>
          </div>
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
        </div>
          <ChatInput/>
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
    currentTurn: (username) => {
      dispatch(updateCurrentTurn(username))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
