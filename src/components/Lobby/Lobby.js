import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { updateRoom } from '../../actions/roomActions';
import { updateGameStart } from '../../actions/gameActions';

// Import UI
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';

import './Lobby.css';

// Import child Components
//
const chatToggleStyle = {

}
const globalChatStyle = {
  paddingBottom: '200px',
  overflow: 'auto',
}
const badgeStyle = {
  position: 'absolute',
  bottom: '0',
  right: '0'
}

export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      roomName: '',
      roomTopic: 'TV',
      errorMessage: '',
      open: false,
      chatmsg: '',
      chatList: [],
      missedMsg: 0
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

    // User info updating
    userRoomUpdating(this.props.user[0].id, roomkey);
    // Room Key updating on redux
    this.props.roomUpdating(roomkey);

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

/**
 * Chat related
 */
  toggleChatDrawer = () => {
    this.setState({open: !this.state.open});

    const chatList = this.state.chatList;
    chatList.forEach((e) => {
      if(!e.read) e.read = true;
    })

    this.setState({ missedMsg: 0});
  }
  handleClose = () => this.setState({open: false});

  onChangeChat = (e) => {
    this.setState({chatmsg: e.target.value});
  }
  onKeypressChat = (e) => {
    if (e.key === 'Enter') {
      const message = this.messageHelper();
      firebase.database().ref('message/').push(message);
      this.setState({chatmsg: ''});
    }
  }
  onClickSend = (e) => {
    const message = this.messageHelper();
    firebase.database().ref('message/').push(message);
    this.setState({chatmsg: ''});
  }

  messageHelper = () => {
    const message = {};
    message.text = this.state.chatmsg;
    message.senderID = this.props.user[0].id;
    message.senderName = this.props.user[0].displayName;
    message.photo = this.props.user[0].photo;
    message.key = uuid();
    return message;
  }

  componentDidMount() {
    this.scrollToBottom();

    firebase.database().ref('message/').limitToLast(1).on('child_added', (data) => {
        const chatListArr = this.state.chatList;
        const newMessage = data.val();
        if (this.state.open)  {
          newMessage.read = true;
          this.setState({ missedMsg: 0});
        } else {
          newMessage.read = false;
          let unreadNum = this.state.missedMsg;
          unreadNum += 1;
          this.setState({ missedMsg: unreadNum});
        }
        chatListArr.push(newMessage)
        this.setState({chatList: chatListArr});
    });
  }

  renderChat = () => {
    const returnArr = []

    this.state.chatList.forEach((e, i) => {
      let checker = false;
      if (e.senderID === this.props.user[0].id) {
        checker = true;
      }
      returnArr.push(
        <div className="chatContentWrapper" key={uuid()}>
          {checker ? (
            <ListItem disabled={true}
                      rightAvatar={<Avatar src={e.photo} />}>
              <div className="rightChatWrapper">
                <div className="chatSenderRight">{'@ ' + e.senderName}</div>
                <div className="chatTextRight">{e.text}</div>
              </div>
            </ListItem>
          ) : (
            <ListItem disabled={true}
                      leftAvatar={<Avatar src={e.photo} />}>
              <div className="chatSenderLeft">{'@ ' + e.senderName}</div>
              <div>{e.text}</div>
            </ListItem>
          )}
        </div>
      )
    })
    return returnArr;
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
  }

  componentDidUpdate() {
    this.scrollToBottom(); // auto scroll down.
  }

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
          <Badge badgeContent={this.state.missedMsg}
                 primary={true}
                 className='chatBadge'
                 style={badgeStyle}/>
          <FloatingActionButton secondary={true}
                                className="chatToggle"
                                style={chatToggleStyle}
                                onTouchTap={this.toggleChatDrawer}>

            <FontIcon className="material-icons">chat</FontIcon>
          </FloatingActionButton>

          <Drawer width={400} openSecondary={true}
                  open={this.state.open}
                  onRequestChange={(open) => this.setState({open})}
                  docked={false}
                  containerClassName="globalChat"
                  containerStyle={globalChatStyle}>
            <AppBar iconElementRight={<IconButton><NavigationClose onTouchTap={this.handleClose}/></IconButton>}
                    iconClassNameLeft='chatLeftIconNone'
                    />
            <div className="chatInputGroup">
              <TextField floatingLabelText="messages..."
                         fullWidth={true}
                         onChange={this.onChangeChat}
                         onKeyPress={this.onKeypressChat}
                         value={this.state.chatmsg}/>
              <RaisedButton label="Send" secondary={true}
                            className="sendBtn"
                            onTouchTap={this.onClickSend}/>
            </div>
            <div className="chatListWrapper">
              {this.renderChat()}
              <div id="messagesEnd"
                   ref={(el) => this.messagesEnd = el} />
            </div>
          </Drawer>
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
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
