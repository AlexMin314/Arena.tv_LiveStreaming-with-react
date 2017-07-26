import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { firebaseDB, userRoomUpdating } from '../../../firebase';
import firebase from '../../../firebase';

import './UserlistChat.css';

// Import child Components

export class Userlist extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      messages: [],
      userList: []
    }
  }

  componentDidMount() {

    /**
     * EventListener for Chat
     */
    const messageRef = firebase.database().ref('rooms/' + this.props.roomkey + '/message');

    messageRef.on('child_added', (data) => {
      const messages = this.state.messages;
      const userList = this.state.userList;
      const newMsgObj = data.val();
      // Sorting the new chat for assigning slotNum.
      userList.forEach((e) => {
        if (e.id === newMsgObj.senderID) newMsgObj.slotNum = e.slotNum;
      });

      // Storing the sorted chat. - for the entire chat list.
      messages.push(newMsgObj);
      this.setState({ messages: messages });
    });


    /**
     * EventListener for UserList
     */
    const membersRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');

    membersRef.on('child_added', (data) => {
      const userList = this.state.userList;
      userList.push(data.val());

      // Assign slot number to user.
      userList.forEach((e, idx) => {
        if (e.id === data.val().id) e.slotNum = idx;
      });
      this.setState({ userList: userList });
    });

    membersRef.on('child_removed', (data) => {
      const userList = this.state.userList;
      userList.forEach((e, idx) => {
        if (e.id === data.val().id) userList.splice(idx, 1);
      });
      this.setState({ userList: userList });
    });

  }

 /**
  * Rendering UserList
  */
  renderUserList = () => {
    const renderList = [];

    for(let i = 0; i < 6; i++) {
      if(!this.state.userList[i]) {
        renderList.push(<div className="nameCardsBG shadowOut"
                             key={uuid()}>&#43;</div>);
      } else {
        renderList.push(<div className="nameCard shadowOut"
                              key={uuid()}>
                              {this.state.userList[i].displayName}</div>);
      }
    }
    return renderList;
  }

  /**
   * Rendering Chat to each slots.
   */
  renderChat = (filter) => {
    const chatList = [];
    this.state.messages.forEach((e) => {
      if (e.slotNum == filter) {
        chatList.push(<div className="chatBubble arrow_box shadowOut hideMe"
                           key={e.key}>{e.text}</div>)
      }
    })
    return chatList[chatList.length - 1];
  }

  render() {

    return (
      <div className="userListWrapper">
        <div className="chatWrapper">
        <div className="chatPosition" id="0">{this.renderChat(0)}</div>
        <div className="chatPosition" id="1">{this.renderChat(1)}</div>
        <div className="chatPosition" id="2">{this.renderChat(2)}</div>
        <div className="chatPosition" id="3">{this.renderChat(3)}</div>
        <div className="chatPosition" id="4">{this.renderChat(4)}</div>
        <div className="chatPosition" id="5">{this.renderChat(5)}</div>
        </div>
        {this.renderUserList()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Userlist);
