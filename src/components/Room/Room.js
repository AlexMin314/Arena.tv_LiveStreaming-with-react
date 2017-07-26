import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB,
         userRoomUpdating,
         roomMemberUpdating } from '../../firebase';
import firebase from '../../firebase';

import './Room.css';

// Import child Components
import UserlistChat from './UserlistChat/UserlistChat';


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
        console.log(snapshot.val());
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

      firebase.database().ref('/rooms/' + this.state.room + '/members')
        .once('value')
        .then((snapshot) => {
          const members = snapshot.val();
          for(const key in members) {
            if (members[key].id === this.props.user[0].id) {
              roomMemberUpdating(this.state.room, key, {}, true);
            }
          }
          window.location.href = '/lobby';
        })
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
              <div className="sidebars">
                <div>
                  <button type="button"
                          className="btn btn-primary"
                          onClick={this.leaveRoom}>
                          Leave Room</button>

                          <div className="input-group">
                            <input type="text"
                                   className="form-control"
                                   placeholder="Type Messages..."
                                   value={this.state.msg}
                                   onChange={this.onChangeChat}/>
                            <span className="input-group-btn">
                              <button className="btn btn-secondary"
                                      type="button"
                                      onClick={this.sendChat}>Testing</button>
                            </span>
                          </div>


                </div>
              </div>
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
