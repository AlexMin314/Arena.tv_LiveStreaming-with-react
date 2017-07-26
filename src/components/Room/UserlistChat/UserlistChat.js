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
      messageInfo: [],
      messages: [],
      userList: []
    }
  }

  componentWillReceiveProps(nextProps) {
    // chat testing purpose
    const messageRef = firebase.database().ref('rooms/' + nextProps.room + '/message');
    messageRef.on('child_added', (data) => {
      console.log(data.val());
      const newInfo = this.state.messageInfo;
      newInfo.push(data.val());
      const newChat = this.state.messages;
      newChat.push(<div className="chatDisplayLeft arrow_box_left"
                                                    key={this.index++}>{data.val().text}</div>);
      this.setState({
        messageInfo: newInfo,
        messages: newChat,
      });
    });

    /* need to change */
    const membersRef = firebase.database().ref('rooms/' + nextProps.room + '/members');

    console.log(membersRef)
    console.log(nextProps.room)

    membersRef.on('child_changed', (data) => {
      console.log('entered1')
      console.log(data.val())
    })
    membersRef.on('child_removed', (data) => {
      console.log('entered2')
      console.log(data.val())
    })
    membersRef.on('child_added', (data) => {
      console.log('entered3')
      console.log(data.val())
    })
  }

  componentDidMount() {
    console.log(this.state)

  }

  renderUserList = () => {

    const renderList = [];

    for(let i = 0; i < 6; i++) {
      if(!this.state.userList[i]) {
        renderList.push(<div className="nameCardsBG shadowOut"
                             key={this.index++}>&#43;</div>);
      } else {
        renderList.push(<div className="nameCard shadowOut"
                             key={this.index++}>{this.state.userList[i].name}
                        </div>);
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
      user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Userlist);
