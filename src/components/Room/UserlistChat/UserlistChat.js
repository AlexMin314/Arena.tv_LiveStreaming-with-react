import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { firebaseDB,
         userRoomUpdating,
         stageWinnerUpdater,
         currentWordGenerating,
         turnChangingLogic } from '../../../firebase';
import firebase from '../../../firebase';

import './UserlistChat.css';

// Import child Components

export class Userlist extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.readyCheker = {};
    this.turnDisplay = {};
    this.state = {
      messages: [],
      userList: [],
      currentWord: ''
    }
  }

  componentDidMount() {

    /**
     * EventListener for Chat
     */
    const messageRef = firebase.database().ref('rooms/' + this.props.roomkey + '/message');

    // Chat Updater
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

    // Fire winning info to firebase
    messageRef.on('child_added', (data) => {
       const latestChat = data.val().text.toLowerCase();
       const chatSender = data.val().senderID;
       const me = this.props.user[0];
       const curTurnAnswer = this.state.currentWord.toLowerCase();

      if (latestChat === curTurnAnswer &&
         chatSender === me.id &&
         me.id !== this.state.userList[this.props.turnInfo].id) {

         /* Need a stage Number Logic!!! */
         const testStageNumber = 1;
         // stageWinnerUpdater for firebase
         stageWinnerUpdater(this.props.roomkey, me, testStageNumber);
         // Turn changer
         turnChangingLogic(this.props.roomkey)
         // currentWord Generation requesting
         currentWordGenerating(this.props.roomkey, this.props.memberKey, this.props.topic, this.props.turnInfo)
      }
    })

    /**
     * Game Logic related
     */
     // Get currentWord of the turn
     const curKeywordRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentWord');
     curKeywordRef.on('value', (data) => {
       this.setState({ currentWord: data.val() })
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

    const readyRef = firebase.database().ref('rooms/' + this.props.roomkey + '/members');
    readyRef.on('child_changed', (data) => {
      const userList = this.state.userList;
      userList.forEach((e, idx) => {
        if (e.id === data.val().id) {
          // change ready checker(green)
          this.readyCheker[idx].style.display = 'flex';
        }
      });
    });

  } // componentDidMount Ends.

  componentDidUpdate() {
    /**
     * EventListener for Turn Indicator(Star) Display
     */
    const turnRef = firebase.database().ref('rooms/' + this.props.roomkey + '/currentTurn');
    turnRef.on('value', (data) => {
      if (this.props.gameStart) {
        const userList = this.state.userList;
        userList.forEach((e, idx) => {
          this.turnDisplay[idx].style.display = 'none';
          if (idx === data.val()) {
            this.turnDisplay[idx].style.display = 'flex';
          }
        });
      }
    });
  }

  /**
   * If the user click name card... then?
   */
  expandCard = (e) => {
    // Testing version.
    console.log(e.target.className)
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
                              <div className="scoreDisplay">Test Score</div>
                              {this.state.userList[i].displayName || this.state.userList[i].username}
                              </div>);
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
  userinfoRender = (checker) => {
    const renderList = [];
    const startStatus = checker ? 'turnHostDisplay' : null;
    for(let i = 0; i < 6; i++) {
      if(!this.state.userList[i]) {
        renderList.push(<div className="infoPosition"
                             key={uuid()}
                             onClick={this.expandCard}>
                        </div>);
      } else {
        renderList.push(<div className="infoPosition"
                             key={uuid()}
                             onClick={this.expandCard}>
                          <div className="readyCheker shadowOut"
                               id={startStatus}>
                            {checker ? null : (
                              <i className="fa fa-check fa-lg"
                                 aria-hidden="true"
                                 ref={(e) => this.readyCheker[i] = e}></i>
                            )}
                            {checker ? (
                              <i className="fa fa-star fa-2x"
                                 aria-hidden="true"
                                 ref={(e) => this.turnDisplay[i] = e}></i>
                            ) : null}
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
          {this.props.gameStart ? this.userinfoRender(true) : this.userinfoRender(false)}
        </div>
        {this.renderUserList()}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      roomkey: state.room,
      gameStart: state.gameStart,
      turnInfo: state.currentTurn
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Userlist);
