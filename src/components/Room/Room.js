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
    // 전체 ready상태 확인 로직 -> 게임 스타팅
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
    let canvasDiv = document.getElementsByClassName('canvasWrapper')[0];
    canvasDiv.style.backgroundColor = 'rgba(16, 16, 17, 0.54)';
    let inputDiv = document.getElementsByClassName('textInputDiv')[0];
    inputDiv.style.display = 'flex';
    let inputField = document.getElementsByClassName('userTextInput')[0];
    inputField.focus();
    }
  }

  clearInput = () => {
    document.getElementsByClassName('userTextInput')[0].value = '';
    let canvasDiv = document.getElementsByClassName('canvasWrapper')[0];
    canvasDiv.style.backgroundColor = 'white';
    let inputDiv = document.getElementsByClassName('textInputDiv')[0];
    inputDiv.style.display = 'none';
  }

  sendInput = () => {
    let finalInput = document.getElementsByClassName('userTextInput')[0].value;
    let inputDiv = document.getElementsByClassName('textInputDiv')[0];
    let inputField = document.getElementsByClassName('userTextInput')[0];
    let canvasDiv = document.getElementsByClassName('canvasWrapper')[0];
    canvasDiv.style.backgroundColor = 'white';
    inputField.value = '';
    inputField.autofocus = false;
    inputDiv.style.display = 'none';
    if(finalInput !== '') {
      this.sendChat(finalInput);
    }
  }

  render() {
    window.addEventListener("keypress", (e) => {
      this.textTyped(e.key)
    })

    window.addEventListener('keydown', (e) => {
      switch (e.key) {
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
        <div className="input-group input-group-lg textInputDiv">
          <input type="text" className="form-control userTextInput" aria-describedby="sizing-addon1"/>
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
