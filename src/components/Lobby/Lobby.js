import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

// Import firebase
import { userRoomUpdating, updateRoomName } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { updateRoom } from '../../actions/roomActions';
import { updateGameStart } from '../../actions/gameActions';
import { updateNav } from '../../actions/navActions';
import { updateTimerStatus } from '../../actions/timerActions';
import { updateLobby } from '../../actions/lobbyActions';

// Import UI
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';
import Drawer from 'material-ui/Drawer';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import TextField from 'material-ui/TextField';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';
import Paper from 'material-ui/Paper';


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
const lobbymenu = {
  margin: 8,
  padding: 0,
  width: 120,
  height: 80,
  fontSize: 18,
  textAlign: 'center'
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
      missedMsg: 0,
      modalSuccessMesage: '',
      modalErrorMessage: '',
      allPassed: false,
      lobbymenu: null
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
  roomJoinLogic = (rooms, filter, existingRoomName) => {
    if(rooms && existingRoomName && this.state.allPassed) {
      let foundRoom = [];
      let roomkey = '';
      // Iterate over rooms
      for(const key in rooms) {
        if(rooms[key].roomName) {
          if(rooms[key].roomName.toLowerCase() === existingRoomName.toLowerCase()) {
            roomkey = key;
            foundRoom.push(rooms[key]);
            break;
          }
        }
      } // End of for(const key in rooms)

        const memberCount = foundRoom[0].memberCount + 1;
        firebase.database().ref(`/rooms/${roomkey}`)
         .update({ memberCount: memberCount });

        // Push the new user into /rooms/roomkey/members
        const userInfo = this.props.user[0];
        userInfo.ready = false;
        userInfo.score = 0;

        firebase.database().ref(`/rooms/${roomkey}` + '/members')
         .push(userInfo)
         .then(() => {
           // Room Key updating on redux
           this.props.roomUpdating(roomkey);
           // user info updating with room key.
           userRoomUpdating(this.props.user[0].id, roomkey);
           window.location.href = '/room/' + foundRoom[0].roomName.split(' ').join('');
         });
    } // End of if(rooms && existingRoomName)


     if (!rooms && !existingRoomName) {
       this.setState({ errorMessage: 'Sorry, there are no rooms available, why don\'t you try creating one?' });
     } else if(rooms && !existingRoomName){
       // empty array for storing available rooms
       let availableRooms = [];
       // Iterate over rooms
       for (const key in rooms) {
         // Check for available rooms
         if (rooms[key].memberCount > 0 && rooms[key].memberCount < 6 && !rooms[key].gameStart && !rooms[key].gameover) {
           if (filter === null && !existingRoomName) {
             availableRooms.push({roomInfo: rooms[key], _key: key});
           } else if (rooms[key].roomTopic === filter && !existingRoomName) {
             availableRooms.push({roomInfo: rooms[key], _key: key});
           }
         }
       }
      if(availableRooms) {
        if (availableRooms.length === 0) {
          this.setState({ errorMessage: 'All rooms are currently full, please wait and try again or create a room!' });
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
             window.location.href = '/room/' + roomName.split(' ').join('');
           });
        }
      }  // End of if(availableRooms)
    } // End of else if(rooms && !existingRoomName)
  }; // End of Room Joining Logic


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
   * Room Join/Creation Checker- room name storing into the state
   */
  onRoomName = (e) => {
    this.setState({ roomName: e.target.value })
    firebase.database().ref('rooms').once('value', (snapshot) => {
      const roomsObj = snapshot.val();
      if(!roomsObj) this.setState({
        modalErrorMessage: 'Sorry, there are no currently no rooms available, try creating one'
      })
        for (const key in roomsObj) {
          if(roomsObj[key].roomName) {
            if(this.state.roomName !== roomsObj[key].roomName) {
              this.setState({
                modalErrorMessage: 'The room you specified does not exist! Why not try creating one?',
                modalSuccessMessage: ''
              })
            } else if(this.state.roomName.toLowerCase() === roomsObj[key].roomName.toLowerCase()) {
                if(roomsObj[key].gameStart) {
                  this.setState({
                    modalErrorMessage: 'The game has already started, please wait till it is over and try joining again',
                    modalSuccessMessage: ''
                  });
                  break;
                } else if(roomsObj[key].memberCount > 5) {
                  this.setState({
                    modalErrorMessage: 'The room is at it\'s maximum capacity, hopefully someone leaves and you can join',
                    modalSuccessMessage: ''
                  });
                  break;
                } else if(roomsObj[key].gameOver) {
                  this.setState({
                    modalErrorMessage: 'Sorry, the game has ended, if someone chooses to play again, you will be able to join!',
                    modalSuccessMessage: ''
                  });
                  break;
                } else {
                  this.setState({
                    modalErrorMessage: '',
                    modalSuccessMessage: 'Your room is available! Click the Join button to enter!',
                    allPassed: true
                  })
                } // end of the nearest else above
              } // end of else if(e.target.value === roomsObj[key].roomName)
          } // end of if(roomsObj[key].roomName)
        } // end of iteration over rooms objects
    }) // end of firebase ref .then((snapshot))
  };
  onRoomNameCreation = (e) => {
    this.setState({ roomName: e.target.value })
    firebase.database().ref('rooms').once('value', (snapshot) => {
      const roomsObj = snapshot.val();
      if (roomsObj === null) {
        this.setState({
          modalErrorMessage: '',
          modalSuccessMessage: 'Room name available'
        })
      }
      for(const key in roomsObj) {
        if (this.state.roomName === roomsObj[key].roomName) {
          this.setState({
            modalErrorMessage: 'This room name already exists.',
            modalSuccessMessage: ''
          })
        } else {
          this.setState({
            modalErrorMessage: '',
            modalSuccessMessage: 'Room name available'
          })
        }
      }
    })
  }


  /**
   * Room Creation main logic
   */
  onRoomCreation = (e) => {
    e.preventDefault();

    const roomkey = firebase.database().ref().child('rooms').push().key;

    // Get roomName
    let roomName = this.state.roomName;
    // If input field was empty, room name is room key.
    if (roomName === '') roomName = roomkey;
    // // Update room name in firebase
    // updateRoomName(roomkey, roomName);
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
      window.location.href = '/room/' + roomName.split(' ').join('');
    });
  };

/**
 * Chat related
 */
   scrollToBottom = () => {
     this.messagesEnd.scrollIntoView();
     if (!this.state.open && this.props.navInfo === 2) {
       this.messagesEnd1.scrollIntoView();
     }
   }

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
    if (e.key === 'Enter' && this.state.chatmsg !== '') {
      const message = this.messageHelper();
      firebase.database().ref('message/').push(message);
      this.setState({chatmsg: ''});
    }
  }
  onClickSend = (e) => {
    if (this.state.chatmsg !== '') {
      const message = this.messageHelper();
      firebase.database().ref('message/').push(message);
      this.setState({chatmsg: ''});
    }
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
    this.props.navUpdating(0);
    this.setState({
      errorMessage:'',
      allPassed: false,
      modalErrorMessage:'',
      modalSuccessMessage:'',
      roomName:''
    })

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

  componentDidUpdate() {
    this.scrollToBottom(); // auto scroll down.
  }
  /**
   * Join Existing Room Logic
   */
  onJoinExistingRoom = (e) => {
    e.preventDefault();
    this.props.updateTimer(false);
    firebase.database().ref('/rooms').once('value').then((snapshot) => {
      const rooms = snapshot.val();
      this.roomJoinLogic(rooms, null, this.state.roomName);
    });
  }

  clearModalState = () => {
    this.setState({
      modalSuccessMessage: '',
      modalErrorMessage: ''
    });
  }

  /**
   * Join Menu render related
   */

  renderHandler = (e) => {
    this.props.updateLobby(e.target.id);
    this.setState({
      errorMessage:'',
      allPassed: false,
      modalErrorMessage:'',
      modalSuccessMessage:'',
      roomName:''
    })
  }
  renderHandlerClose = (e) => {
    this.props.updateLobby(null);
    this.props.navUpdating(0)
    this.setState({
      errorMessage:'',
      allPassed: false,
      modalErrorMessage:'',
      modalSuccessMessage:'',
      roomName:''
    })
  }


  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row lobbyContent">
          {this.props.navInfo === 2 ? (
            <div className="lobbyContentWrapper">
              <div className="chatWrapperForBottom">
                {this.renderChat()}
                <div id="messagesEnd1"
                     key={uuid()}
                     ref={(el) => this.messagesEnd1 = el} />
              </div>
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
            </div>
          ) : this.props.navInfo === 1 ? (
            <div className="lobbyContentWrapper">
              <IconButton className="lobbyClose" onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
              <div className="subtitleText animated bounce">Create Room</div>
              <div className="subtitleText"><hr/></div>
              <TextField floatingLabelText={this.state.modalSuccessMessage}
                         hintText="(optional) Enter room name..."
                         errorText={this.state.modalErrorMessage}
                         fullWidth={true}
                         className="roomCreateInput"
                         onChange={this.onRoomNameCreation}
                         value={this.state.roomName}/>
              <div className="btn-group categoryRadio" data-toggle="buttons">
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
              </div> {/* End of Radio */}
              <div className="subtitleText"><hr/></div>
              <RaisedButton label="Create" secondary={true} fullWidth={true}
                            className="roomCreateBtn"
                            onTouchTap={this.onRoomCreation}/>
            </div>
          ) : this.props.lobbyInfo === null ? (
          <div className="lobbyContentWrapper">
            <div className="subtitleText animated bounce">Join Room</div>
            <div className="subtitleText"><hr/></div>
            <div className="paperWrapper animated zoomIn">
              <Paper style={lobbymenu} className="pulse1" zDepth={2}>
                <button className="pulse1"
                        onClick={this.renderHandler}
                        id='b1'>BY<br/>TOPIC</button>
              </Paper>
              <Paper style={lobbymenu} onTouchTap={this.onQuickJoin} className="pulse1" zDepth={2}>
                <button className="pulse1"
                        onClick={this.onQuickJoin}
                        id='b2'>QUICK<br/>JOIN</button>
              </Paper>
              <Paper style={lobbymenu} className="pulse1" zDepth={2}>
                <button className="pulse1"
                        onClick={this.renderHandler}
                        id='b3'>BY<br/>NAME</button>
              </Paper>
            </div>
            <div className="errorMessage">{this.state.errorMessage}</div>
          </div>
        ) : this.props.lobbyInfo === 'b1' ? (
          <div className="lobbyContentWrapper1">
            <IconButton className="lobbyClose" onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
            <div className="subtitleText animated bounce">Select a Topic</div>
            <div className="subtitleText"><hr/></div>
            <div className="categoryWrapper">
              <div className="category categoryAni TV" onClick={this.topicJoin}>TV</div>
              <div className="category categoryAni game" onClick={this.topicJoin}>GAMES</div>
              <div className="category categoryAni IT" onClick={this.topicJoin}>ANIME</div>
              <div className="category categoryAni logos" onClick={this.topicJoin}>LOGOS</div>
              <div className="category categoryAni travel" onClick={this.topicJoin}>TRAVEL</div>
            </div>
            <div className="errorMessage">{this.state.errorMessage}</div>
          </div>
        ) : this.props.lobbyInfo === 'b3' ? (
          <div className="lobbyContentWrapper2">
            <IconButton className="lobbyClose" onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
            <div className="subtitleText animated bounce">Enter room name</div>
            <div className="subtitleText"><hr/></div>
            <TextField floatingLabelText={this.state.modalSuccessMessage}
                       hintText="Enter room name here..."
                       errorText={this.state.modalErrorMessage}
                       fullWidth={true}
                       className='joinRoomInput'
                       onChange={this.onRoomName}
                       value={this.state.roomName}/>
            <RaisedButton label="Join" secondary={true} fullWidth={true}
                          className="joinRoomBtn"
                          onTouchTap={this.roomJoinLogic}/>
          </div>
        ) : null}


          {/* chat part */}
          <Badge badgeContent={this.state.missedMsg}
                 primary={true}
                 className='chatBadge animated infinite rubberBand'
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
                   key={uuid()}
                   ref={(el) => this.messagesEnd = el} />
            </div>
          </Drawer>

        </div> {/* contentBody Wrapper End*/}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      roomkey: state.room,
      navInfo: state.nav,
      lobbyInfo: state.lobby
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
    navUpdating: (nav) => {
      dispatch(updateNav(nav))
    },
    updateTimer: (timerStatus) => {
      dispatch(updateTimerStatus(timerStatus))
    },
    updateLobby: (status) => {
      dispatch(updateLobby(status))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
