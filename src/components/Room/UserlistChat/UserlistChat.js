import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB, userRoomUpdating } from '../../../firebase';
import firebase from '../../../firebase';

import './UserlistChat.css';

// Import child Components

export class Userlist extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.index = 0;
    this.state = {
      messages: [],
      userList: []
    }
  }

  componentDidMount() {

    /* Chat Event Listening */
    const messageRef = firebase.database().ref('rooms/' + this.props.roomkey + '/message');

    messageRef.on('child_added', (data) => {
      const messages = this.state.messages;
      const userList = this.state.userList;
      const newMsgObj = data.val();
      // Sorting the new chat for assigning slotNum.
      userList.forEach((e) => {
        if (e.id === newMsgObj.senderID) {
          newMsgObj.slotNum = e.slotNum;
        }
      });
      // Storing the sorted chat.
      messages.push(newMsgObj);
      this.setState({ messages: messages });
    });


    /* User List */
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
                             key={this.index++}
                             id={i}>&#43;</div>);
      } else {
        renderList.push(<div className="nameCard shadowOut"
                             key={this.index++}
                             id={i}>
                             {this.state.userList[i].displayName}</div>);
      }
    }
    return renderList;
  }

  render() {

    return (
      <div className="userListWrapper">
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
