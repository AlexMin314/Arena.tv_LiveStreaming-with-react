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

    this.readyCheker = {};
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

    /**
     * EventListener for Ready Status
     */

    // If we have some changed on user obj in members, need to change this.
    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');
    readyRef.on('child_changed', (data) => {
      const userList = this.state.userList;
      userList.forEach((e, idx) => {
        if (e.id === data.val().id) {
          this.readyCheker[idx].style.display = 'flex';
        }
      })
      console.log(this.readyCheker);

    })
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

  /**
   * Rendering Ready Status to each slots.
   */
  userinfoRender = () => {
    const renderList = [];
    for(let i = 0; i < 6; i++) {
      if(!this.state.userList[i]) {
        renderList.push(<div className="infoPosition"key={uuid()}>
                        </div>);
      } else {
        renderList.push(<div className="infoPosition" key={uuid()}>
                          <div className="readyCheker shadowOut">
                            <i className="fa fa-check fa-lg"
                               aria-hidden="true"
                               id={'checker' + i}
                               ref={(e) => { this.readyCheker[i] = e; }}></i>
                          </div>
                        </div>);
      }
    }
    return renderList;
  }

  render() {

    return (
      <div className="userListWrapper">
        <div className="chatWrapper">
          <div className="chatPosition">{this.renderChat(0)}</div>
          <div className="chatPosition">{this.renderChat(1)}</div>
          <div className="chatPosition">{this.renderChat(2)}</div>
          <div className="chatPosition">{this.renderChat(3)}</div>
          <div className="chatPosition">{this.renderChat(4)}</div>
          <div className="chatPosition">{this.renderChat(5)}</div>
        </div>
        <div className="userInfoWrapper">
          {true ? this.userinfoRender() : null}
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
