import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB, userRoomUpdating } from '../../firebase';
import firebase from '../../firebase';

import './Lobby.css';

// Import child Components

export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
    this.state = {
      roomName: '',
      roomTopic: 'TV'
    }
  }

  // Function to return a random number between a specified range
  getRandomIntInRange = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
  }

  onQuickJoin = (e) => {
    e.preventDefault();
    firebase.database().ref('/rooms').once('value').then((snapshot) => {
      const rooms = snapshot.val();

      // empty array for storing available rooms
      let availableRooms = [];

      // Iterate over rooms
      for (const key in rooms) {
        // Check for available rooms
        if (rooms[key].memberCount) {
          availableRooms.push(rooms[key]);
          // const roomName = rooms[key].roomName;
          /* Need a logic for room, user updating */
          // window.location.href = '/room/' + roomName;
        }
      }
      const maxNum = this.getRandomIntInRange(0, availableRooms.length);
      const roomName = availableRooms[maxNum].roomName;
      const userId = firebase.auth().currentUser.uid;
      firebase.database().ref('/users/' + userId).update({
        roomName: roomName
      })
      window.location.href = '/room/' + roomName;
    });
  }

  onRadioSelect = (e) => {
    // store room topic.
    this.setState({ roomTopic: e.target.innerHTML });
  }

  onRoomName = (e) => {
    // store room name.
    this.setState({ roomName: e.target.value });
  }

  onRoomCreation = (e) => {
    e.preventDefault();

    const roomkey = firebase.database().ref().child('rooms').push().key;

    // Get roomName
    let roomName = this.state.roomName.split(' ').join('');
    if (roomName === '') roomName = roomkey;

    // User info updating
    userRoomUpdating(this.props.user[0].id, roomName);

    // Store to firebase (for testing)
    const newRoom = {};
    newRoom.roomTopic = this.state.roomTopic;
    newRoom.roomName = roomName;
    newRoom.members = {}
    newRoom.members['1'] = this.props.user[0];

    // redirect to room.
    firebase.database().ref('rooms').push(newRoom).then(() => {
      window.location.href = '/room/' + roomName;
    });
  }

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row lobbyContent">
          <div className="lobbyContentWrapper">
            <div className="subtitleText">Choose Your Topic</div>
            <hr/>
            <div className="categoryWrapper">
              <div className="category TV">TV</div>
              <div className="category game">GAME</div>
              <div className="category IT">IT</div>
              <div className="category sports">SPORTS</div>
              <div className="category travel">TRAVEL</div>
            </div>
            <div className="subtitleText"><hr/></div>
            {/* Button trigger modal */}
            <button type="button"
                    className="btn btn-primary"
                    id="createRoomBtn"
                    data-toggle="modal"
                    data-target="#createRoomModal">CREATE ROOM</button>
            <button type="button"
                    className="btn btn-primary"
                    onClick={this.onQuickJoin}>QUICK JOIN</button>
          </div>
        </div> {/* Wrapper End*/}

        {/* Modal */}
        <div className="modal" id="createRoomModal" role="dialog"
             aria-labelledby="createRoomModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title"
                    id="createRoomModalLabel">CREATE ROOM</h5>
                <button type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="modalSubtitle">Room Name</div>
                  <input type="text" className="form-control"
                         placeholder="Enter RoomName...(optional)"
                         onChange={this.onRoomName}/>
                <div className="modalSubtitle">Select Topic</div>
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn btn-primary active" id="mRadio1"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal TV">TV</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio2"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal game">GAME</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio3"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal IT">IT</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio4"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal sports">SPORTS</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio5"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal travel">TRAVEL</div>
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal">CLOSE</button>
                <button type="button"
                        className="btn btn-primary"
                        onClick={this.onRoomCreation}>CREATE</button>
              </div>
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

  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
