import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { userRoomUpdating, updateRoomName } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { updateRoom } from '../../actions/roomActions';
import { updateGameStart } from '../../actions/gameActions';
import { updateTimerStatus } from '../../actions/timerActions';

import './Lobby.css';

// Import child Components

export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
    this.state = {
      roomName: '',
      roomTopic: 'TV',
      errorMessage: ''
    }
  }

  componentDidMount() {
    // Reseting game start value in redux.
    this.props.gameStart(false)
  }

  // Helper Function to return a random number between a specified range
  getRandomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  /**
   * Room Joining
   */

   // Room Joining Logic
   roomJoinLogic = (rooms, filter) => {

     if (!rooms) {
       this.setState({ errorMessage: 'Sorry, there are no rooms available, why don\'t you try creating one?' });
     } else {
       // empty array for storing available rooms
       let availableRooms = [];
       // Iterate over rooms
       for (const key in rooms) {
         // Check for available rooms
         if (rooms[key].memberCount > 0 && rooms[key].memberCount < 6 && !rooms[key].gameStart && !rooms[key].gameover) {
           if (filter === null) {
             availableRooms.push({roomInfo: rooms[key], _key: key});
           } else if (rooms[key].roomTopic === filter) {
             availableRooms.push({roomInfo: rooms[key], _key: key});
           }
         }
       }

       if (availableRooms.length === 0) {
         this.setState({errorMessage: 'All rooms are currently full, please wait and try again or create a room!'})
       } else {
         // Get a random number within the range of the size of the availableRooms array
         const randomNum = this.getRandomIntInRange(0, availableRooms.length);
         // Assign the filtered room to variable
         const roomName = availableRooms[randomNum].roomInfo.roomName;
         // Add member count of the filtered room
         const memberCount = availableRooms[randomNum].roomInfo.memberCount + 1;
         // Get ID of current user
         const userId = this.props.user[0].id;

         firebase.database().ref(`/rooms/${availableRooms[randomNum]._key}`)
          .update({ memberCount: memberCount });

         // Push the new user into /rooms/roomkey/members
         const userInfo = this.props.user[0];
         userInfo.ready = false;
         userInfo.score = 0;

         firebase.database().ref(`/rooms/${availableRooms[randomNum]._key}` + '/members')
          .push(userInfo)
          .then(() => {
           this.setState({ 'roomName': availableRooms[randomNum]._key })
          })
          .then(() => {
            // Room Key updating on redux
            this.props.roomUpdating(availableRooms[randomNum]._key);
            // user info updating with room key.
            userRoomUpdating(this.props.user[0].id, availableRooms[randomNum]._key);
            window.location.href = '/room/' + roomName;
          });
       }
     }
   };


  // Quick Join
  onQuickJoin = (e) => {
    e.preventDefault();
    this.props.updateTimer(false);
    firebase.database().ref('/rooms').once('value').then((snapshot) => {
      const rooms = snapshot.val();
      this.roomJoinLogic(rooms, null);
    });
  };

  // Topic base join
  topicJoin = (e) => {
    e.preventDefault();
    const topic = e.target.innerHTML;
    firebase.database().ref('/rooms').once('value').then((snapshot) => {
      const rooms = snapshot.val();
        this.roomJoinLogic(rooms, topic);
    });
  }


  /**
   * Topic Selection
   */
  onRadioSelect = (e) => {
    // store room topic.
    this.setState({ roomTopic: e.target.innerHTML });
  };

  /**
   * Room Creation - room name storing into the state
   */
  onRoomName = (e) => {
    // store room name.
    this.setState({ roomName: e.target.value });
  };

  /**
   * Room Creation main logic
   */
  onRoomCreation = (e) => {
    e.preventDefault();

    const roomkey = firebase.database().ref().child('rooms').push().key;

    // Get roomName
    let roomName = this.state.roomName.split(' ').join('');
    // If input field was empty, room name is room key.
    if (roomName === '') roomName = roomkey;
    // Update room name in firebase
    updateRoomName(roomkey, roomName);
    // User info updating
    userRoomUpdating(this.props.user[0].id, roomkey);
    // Room Key updating on redux
    this.props.roomUpdating(roomkey);
    this.props.updateTimer(false);
    // Updating object
    const userInfo = this.props.user[0];
    userInfo.ready = false;
    userInfo.score = 0;

    const newRoom = {};
    newRoom.roomTopic = this.state.roomTopic;
    newRoom.roomName = roomName;
    newRoom.members = {}
    newRoom.members['1'] = userInfo;
    newRoom.memberCount = 1;
    newRoom.stages = 0;
    newRoom.gameStart = false;
    newRoom.gameover = false;
    newRoom.currentWord = 'Not Started';
    newRoom.currentTurn = 0;
    newRoom.winnerOfStage = ['init'];
    newRoom.countDownStarted = false;
    newRoom.startTimer = false;
    // Make new room to firebase, redirect to room.
    firebase.database().ref('rooms').child(roomkey).set(newRoom).then(() => {
      window.location.href = '/room/' + roomName;
    });
  };

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row lobbyContent">
          <div className="lobbyContentWrapper">
            <div className="subtitleText">Choose Your Topic</div>
            <hr/>
            <div className="categoryWrapper">
              <div className="category TV" onClick={this.topicJoin}>TV</div>
              <div className="category game" onClick={this.topicJoin}>GAMES</div>
              <div className="category IT" onClick={this.topicJoin}>ANIME</div>
              <div className="category logos" onClick={this.topicJoin}>LOGOS</div>
              <div className="category travel" onClick={this.topicJoin}>TRAVEL</div>
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
                    id="quickJoinBtn"
                    onClick={this.onQuickJoin}>QUICK JOIN</button>
            <br/>
            <div className="errorMessage">{this.state.errorMessage}</div>
          </div>
        </div> {/* contentBody Wrapper End*/}


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
                <div className="btn-group" id="modalTopic" data-toggle="buttons">
                  <label className="btn btn-primary active" id="mRadio1"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal TV">TV</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio2"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal game">GAMES</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio3"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal IT">ANIME</div>
                  </label>
                  <label className="btn btn-primary" id="mRadio4"
                         onClick={this.onRadioSelect}>
                    <input type="radio" autoComplete="off"/>
                    <div className="category categoryModal logos">LOGOS</div>
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
      user: state.user,
      roomkey: state.room
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    roomUpdating: (room) => {
      dispatch(updateRoom(room))
    },
    gameStart: (checker) => {
      dispatch(updateGameStart(checker))
    },
    updateTimer: (timerStatus) => {
      dispatch(updateTimerStatus(timerStatus))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
