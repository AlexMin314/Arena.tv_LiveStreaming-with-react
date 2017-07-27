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
      memberKey: ''
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
      }
    );

    // Get gameStart status - game start!
    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/gameStart');
    readyRef.on('value', (data) => this.props.gameStart(data.val()))

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

  render() {

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
                </div>
                <div className="sideRow">
                  {this.state.ready ? (
                    <button type="button"
                            className="btn btn-primary disabled"
                            onClick={this.gameReady}>
                            Waiting Others</button>
                  ) : (
                    <button type="button"
                            className="btn btn-primary"
                            onClick={this.gameReady}>
                            Game Ready</button>
                  )}
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
      roomkey: state.room
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    gameStart: (checker) => {
      dispatch(updateGameStart(checker))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
