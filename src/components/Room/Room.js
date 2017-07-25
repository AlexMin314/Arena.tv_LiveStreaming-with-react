import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB, userRoomUpdating } from '../../firebase';
import firebase from '../../firebase';

import './Room.css';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';

/**
 * Login
 */
export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      'msg': '',
      'room': ''
    }
  }

  componentDidMount() {
    // get uid from redux
    const uid = this.props.user[0].id;
    // get current room key and store to the state.
    firebase.database().ref('/users/' + uid + '/room').once('value')
      .then((snapshot) => {

      this.setState({ 'room': snapshot.val() });
    })
  }

  onChangeChat = (e) => {
    // saving current chat msg to the state.
    this.setState({ 'msg': e.target.value });
  };

  sendChat = (e) => {
    const message = {};
    /* If possible, change this Id part to slot number of the sender */
    message.senderID = this.props.user[0].id;
    message.senderName = this.props.user[0].displayName;
    message.text = this.state.msg;

    // saving msg to the room object in firebase.
    firebase.database().ref('rooms/' + this.state.room + '/message').push(message);
    // resetting the state and input field.
    this.setState({ 'msg': '' });
  }

  leaveRoom = () => {
      window.location.href = '/lobby';
  }

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row roomContent">
          <div className="col-lg-2 hidden-md-down sectionDivider"></div>
          <div className="col-lg-8 col-md-12 sectionDivider">
            <div className="" id="mainContentWrapper">
              <div className="sidebars"></div>
              <div className="canvasWrapper shadowOut"></div>
              <div className="sidebars"></div>
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
      user: state.user
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
