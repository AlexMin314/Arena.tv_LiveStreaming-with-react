import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import { connect } from 'react-redux';

// Import Firebase
import firebase from '../../../firebase';

// Import CSS
import './ChatInput.css';

// Import uuid
import uuid from 'uuid/v4';

// Global variables
let typedTextArray = [];

/**
 * Chat Input
 */
export class ChatInput extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
    this.state = {
      textInput: ''
    }
  }

  /**
   * Chat related.
   */

  // Focus on the input field
  focus = () => {
    this.textInput.focus();
  }

  // Remove focus from the input field
  blur = () => {
    this.textInput.blur();
  }

  // Show the div which contains the input field
  show = () => {
    this.inputDiv.style.display = 'flex';
  }

  // Hide the div which contains the input field
  hide = () => {
    this.inputDiv.style.display = 'none';
  }

  // Send chat message to firebase and clear input field
  sendChat = (finalInput) => {
      this.blur();
      this.hide();
      this.setState({
        textInput: ''
      })
      const message = {};
      message.key = uuid();
      message.senderID = this.props.user[0].id;
      message.senderName = this.props.user[0].displayName || this.props.user[0].username;
      message.text = finalInput;
      // saving msg to the room object in firebase.
      firebase.database().ref('rooms/' + this.props.roomkey + '/message').push(message);
  }

  // Any typing from user will trigger set focus on input field
  handleInputUp = (e) => {
    this.show();
    this.focus();
  }

  // function to handle keys such as "Enter" and "Escape"
  handleKeyPress = (e) => {
    if(e.key === "Enter" && this.state.textInput === '') {
      this.focus();
    }
    else if(e.key === "Escape") {
      this.setState({
        textInput: ''
      })
      this.blur();
      this.hide();
    }
    else if(e.key === "Enter" && this.state.textInput !== '') {

      this.sendChat(this.state.textInput);
    }
  }

  // updates the text input state of user everytime there is a change in input field
  handleInput = (e) => {
      this.setState({
        textInput: e.target.value
      })
  }

  componentDidMount() {
  // Event listeners for chat input.
  window.addEventListener('keypress', this.handleInputUp);
  window.addEventListener('keypress', this.handleKeyPress);
  }

  render() {

      return (
        <div className="input-group input-group-lg textInputDiv"
             ref={(div) => { this.inputDiv = div; }}>
          <input type="text"
                 className="form-control userTextInput shadowOut"
                 aria-describedby="sizing-addon1"
                 onChange={this.handleInput}
                 value={this.state.textInput}
                 ref={(input) => { this.textInput = input; }}/>
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
