import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { userRoomUpdating,
         roomMemberUpdating } from '../../firebase';
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
      chatInput: ''
    }
  }

  componentDidMount() {

  }

  /**
   * Chat related.
   */
  onChangeChat = (e) => {
    // saving current chat msg to the state.
    this.setState({ 'msg': e.target.value });
  };

  sendChat = (finalInput) => {
    const message = {};
    /* If possible, change this Id part to slot number of the sender */
    message.senderID = this.props.user[0].id;
    message.senderName = this.props.user[0].displayName;
    message.text = finalInput;

    // saving msg to the room object in firebase.
    firebase.database().ref('rooms/' + this.props.roomkey + '/message').push(message);

  }

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
      });
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
                <div>
                  <button type="button"
                          className="btn btn-primary"
                          onClick={this.leaveRoom}>
                          Leave Room</button>

                          <div className="input-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Type Messages..."
                                   value={this.state.msg}
                                   onChange={this.onChangeChat}/>
                            <span className="input-group-btn">
                              <button className="btn btn-secondary"
                                      type="button"
                                      onClick={this.sendChat}>Testing</button>
                            </span>
                          </div>


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
