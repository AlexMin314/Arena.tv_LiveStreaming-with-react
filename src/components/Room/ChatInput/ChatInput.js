import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import { connect } from 'react-redux';

// Import Firebase
import firebase from '../../../firebase';

// Import CSS
import './ChatInput.css';

// Import uuid
import uuid from 'uuid';

// Global variables
let typedTextArray = [];

/**
 * Chat Input
 */
export class ChatInput extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
    this.state = {}
  }

  /**
   * Chat related.
   */

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
        <div className="input-group input-group-lg textInputDiv">
          <input type="text" className="form-control userTextInput" aria-describedby="sizing-addon1"/>
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
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatInput);
