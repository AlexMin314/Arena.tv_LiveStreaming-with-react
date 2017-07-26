import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating,
         readyUpdating } from '../../firebase';
import firebase from '../../firebase';

import './Room.css';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';

// Global variables
let typedTextArray = [];

export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      msg: '',
      chatInput: '',
      ready: false
    }
  }

  /**
   * Room related.
   */
  leaveRoom = () => {
    firebase.database().ref('/rooms/' + this.props.roomkey + '/members')
      .once('value')
      .then((snapshot) => {
        const members = snapshot.val();
        for(const key in members) {
          if (members[key].id === this.props.user[0].id) {
            roomMemberUpdating(this.props.roomkey, key, {}, true, '/lobby')
          }
        }
      }
    );
  }

  /**
   * GameLogic related
   */
  gameReady = () => {
    this.setState({ ready: true });
    readyUpdating(true);
  }

  /**
   * Chat related.
   */
  onChangeChat = (e) => {
    // saving current chat msg to the state.
    this.setState({ msg: e.target.value });
  };

  sendChat = (finalInput) => {
    const message = {};
    message.key = uuid();
    message.senderID = this.props.user[0].id;
    message.senderName = this.props.user[0].displayName;
    message.text = finalInput;
    // saving msg to the room object in firebase.
    firebase.database().ref('rooms/' + this.props.roomkey + '/message').push(message);
  }

  textTyped = (textTyped) => {
    if(textTyped !== "Enter") {
      typedTextArray.push(textTyped);
      const textString = typedTextArray.join('');
      document.getElementsByClassName('userTextInput')[0].innerHTML = textString;
    }
  }

  removeLastCharInput = () => {
    typedTextArray.pop();
    const textString = typedTextArray.join('');
    document.getElementsByClassName('userTextInput')[0].innerHTML = textString;
  }

  clearInput = () => {
    typedTextArray = [];
  }

  sendInput = () => {
    const finalInput = typedTextArray.join('');
    typedTextArray = [];
    document.getElementsByClassName('userTextInput')[0].innerHTML = '';
    this.sendChat(finalInput);
  }

  render() {
    window.addEventListener("keypress", (e) => {
      this.textTyped(e.key)
    })

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Backspace':
          this.removeLastCharInput()
          break;
        case 'Escape':
          this.clearInput()
          break;
        case 'Enter':
          this.sendInput()
        default:
          break;
      }
    })

    return (
      <div className="container-fluid contentBody">
        <div className="row roomContent">
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
          <div className="col-lg-8 col-md-12 sectionDivider">
            <div className="" id="mainContentWrapper">
              <div className="sidebars"></div>
              <div className="canvasWrapper shadowOut">
                <div className="userTextInput"></div>
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
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
