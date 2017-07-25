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
    this.indexUser = 0;
    this.state = {
      messageInfo: [],
      messages: [],
      userList: [{'name':'alex'}]
    }
  }

  componentWillReceiveProps(nextProps) {
    // chat testing purpose
    const messageRef = firebase.database().ref('rooms/' + nextProps.room + '/message');
    messageRef.on('child_added', (data) => {
      const newInfo = this.state.messageInfo;
      newInfo.push(data.val());
      const newChat = this.state.messages;
      newChat.push(<div className="chatDisplayLeft arrow_box_left"
                                                    key={this.index++}>{data.val().text}</div>);
      this.setState({
        messageInfo: newInfo,
        messages: newChat
      });
    });
  }

  renderUserList = () => {

    const renderList = [];

    for(let i = 0; i < 6; i++) {
      if(!this.state.userList[i]) {
        renderList.push(<div className="nameCardsBG shadowOut"
                             key={this.indexUser++}>&#43;</div>);
      } else {
        renderList.push(<div className="nameCard shadowOut"
                             key={this.indexUser++}>{this.state.userList[i].name}
                        </div>);
      }
    }
    console.log(renderList);

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
