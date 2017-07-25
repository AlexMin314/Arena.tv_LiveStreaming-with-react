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
      messages: []
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

  render() {

    return (
      <div className="container-fluid hidden-sm-down">
        <div id="userListWrapper">
          <div className="userSpotsLeft">
            <div className="spots">
              {/* Testing Purpose */}
              <div className="userCardLeft row">
                <div className="userPicsLeft"></div>
                <div className="">
                  <div className="profileNameLeft"></div>
                  <div className="gameInfoLeft"></div>
                  <div className="curChanceLeft"></div>
                </div>
              </div>
              {/* Testing Purpose */}
              {this.state.messages[this.state.messages.length - 1]}
            </div>
            <div className="spots">
              {/* Testing Purpose */}
              <div className="userCardLeft row">
                <div className="userPicsLeft"></div>
                <div className="">
                  <div className="profileNameLeft"></div>
                  <div className="gameInfoLeft"></div>
                  <div className="curChanceLeft"></div>
                </div>
              </div>
            </div>
            <div className="spots">
            </div>
          </div>
          <div className="userSpotsRight">
            <div className="spots">
              {/* Testing Purpose / Need to rightside layout */}
              <div className="userCardRight row">
                <div className="userCardInfoRightWrapper">
                  <div className="profileNameRight"></div>
                  <div className="gameInfoRight"></div>
                  <div className="curChanceRight"></div>
                </div>
                <div className="userPicsRight"></div>
              </div>
              {/* Testing Purpose */}
              <div className="chatDisplayRight arrow_box_right">hey, This is chat postion testing</div>
            </div>
            <div className="spots">
            </div>
            <div className="spots">
            </div>
          </div>
        </div>
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
