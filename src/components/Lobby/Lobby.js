import React, { Component } from 'react';
import { connect } from 'react-redux';
import uuid from 'uuid/v4';

// Import firebase
import { userRoomUpdating, updateRoomName } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { updateRoom } from '../../actions/roomActions';
import { updateGameStart } from '../../actions/gameActions';
import { updateNav } from '../../actions/navActions';
import { updateTimerStatus } from '../../actions/timerActions';
import { updateLobby } from '../../actions/lobbyActions';
import { updateNotice } from '../../actions/noticeActions';

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

// Import Utilities
import { getRandomIntInRange,
         clickSoundPlay,
         clickSoundPlay2,
         mouseclickSoundPlay } from '../../API/utilityAPI';

// Import CSS
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
const exitIcon = {
  alignSelf: 'flex-end',
  marginLeft: 'auto'
}


export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.props.updateLobby(null)

    this.state = {
      roomName: '',
      roomTopic: 'TV',
      errorMessage: '',
      open: false,
      chatmsg: '',
      chatList: [],
      modalSuccessMesage: '',
      modalErrorMessage: '',
      allPassed: false,
      onlineUsersCount: 0,
      lobbymenu: null
    }
  }

  componentDidMount() {
    // Reseting game start value in redux.
    this.props.gameStart(false)
  }

  /**
   * Room Joining
   */

   // Room Joining Logic
  roomJoinLogic = (rooms, filter, existingRoomName) => {
    if (this.props.sound) clickSoundPlay();
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
          const randomNum = getRandomIntInRange(0, availableRooms.length);
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
    if (this.props.sound) clickSoundPlay();
    e.preventDefault();
    this.props.updateTimer(false);
    firebase.database().ref('/rooms').once('value').then((snapshot) => {
      const rooms = snapshot.val();
      this.roomJoinLogic(rooms, null);
    });
  };

  // Topic base join
  topicJoin = (e) => {
    if (this.props.sound) clickSoundPlay();
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
    if (this.props.sound) clickSoundPlay2();
    // store room topic.
    this.setState({ roomTopic: e.target.innerHTML });
  };

  /**
   * Room Join/Creation Checker- room name storing into the state
   */
  onRoomName = (e) => {
    this.setState({ roomName: e.target.value })
    if (e.target.value === '') return;
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
    if (this.props.sound) clickSoundPlay();
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
    if (this.props.sound) mouseclickSoundPlay();
    const chatList = this.state.chatList;
    chatList.forEach((e) => {
      if(!e.read) e.read = true;
    })
    this.props.updateNotice(0);
    setTimeout(() => document.getElementById('gloablChatInput').focus(), 200)
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
    this.props.updateNotice(0);

  // Logic for displaying online users in lobby
    const userObj = this.props.user[0];
    const onlineUsersRef = firebase.database().ref('/onlineUsers');
    const onlineUsersCountRef = firebase.database().ref('/onlineUsersCount');
    let userIsAlreadyOnline = false;
    onlineUsersRef.once('value', (snapshot) => {
      if(snapshot.val()) {
        const usersOnlineObj = snapshot.val();
        const currentNoOfUsers = Object.keys(usersOnlineObj).length;
        for(const key in usersOnlineObj) {
          if((usersOnlineObj[key].displayName === this.props.user[0].displayName)
          && (usersOnlineObj[key].email === this.props.user[0].email)) {
            userIsAlreadyOnline = true
          } // end of if((usersOnlineObj[key].displayName === this.props.user[0].displayName)
        } // end of for(const key in usersOnlineObj)

        if(userIsAlreadyOnline) {
          onlineUsersCountRef.once('value', (snapshot) => {
            if(!snapshot.val()) {
              firebase.database().ref().update({ onlineUsersCount: 1});
              this.setState({ onlineUsersCount: 1 });
            } else this.setState({ onlineUsersCount: currentNoOfUsers });
          })
        } // end of if(userIsAlreadyOnline)


      else {
        onlineUsersCountRef.once('value', (snapshot) => {
          if(!snapshot.val()) firebase.database().ref().update({ onlineUsersCount: 1});
          else {
            onlineUsersRef.push(userObj);
            onlineUsersRef.once('value',(snapshot) => {
              const updatedUsersCount = Object.keys(snapshot.val()).length;
              firebase.database().ref().update({ onlineUsersCount: updatedUsersCount });
              this.setState({ onlineUsersCount: updatedUsersCount })
            })
          } // end of nearest else above
        }) // end of onlineUsersCountRef.once('value', (snapshot)
      } // end of else
      } // end of if(snapshot.val())
      else {
        firebase.database().ref('/onlineUsers').push(this.props.user[0]);
      }
    }) // end of onlineUsersRef.once('value', (snapshot)

    // Logic for updating the state of online users when any user logs in or out
    firebase.database().ref('/onlineUsers').on('value', (snapshot) => {
      if(snapshot.val()) {
        const updatedUserCount = Object.keys(snapshot.val()).length;
        this.setState({ onlineUsersCount: updatedUserCount });
      }
    })

  /**************************
  ** End of Online User Logic
  *//////////////////////////
    this.scrollToBottom();
    this.props.navUpdating(0);
    this.setState({
      errorMessage:'',
      allPassed: false,
      modalErrorMessage:'',
      modalSuccessMessage:'',
      roomName:''
    })


    this.scrollToBottom();
    let randomNum = getRandomIntInRange(5,10);
    firebase.database().ref('message/').limitToLast(randomNum).on('child_added', (data) => {
        const chatListArr = this.state.chatList;
        const newMessage = data.val();
        if (this.state.open)  {
          newMessage.read = true;
          this.props.updateNotice(0);
        } else {
          newMessage.read = false;
          let unreadNum = this.props.noticeNum;
          unreadNum += 1;
          this.props.updateNotice(unreadNum);
        }
        chatListArr.push(newMessage)
        this.setState({chatList: chatListArr});
    });
  } // End of componentDidMount

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
    if (this.props.sound) clickSoundPlay();
    this.props.updateTimer(false);

    if(this.state.roomName === '') return

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
    if (this.props.sound) clickSoundPlay2();
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
    if (this.props.sound) clickSoundPlay2();
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
                           value={this.state.chatmsg} autoFocus
                           />
                <RaisedButton label="Send" secondary={true}
                              className="sendBtn"
                              onTouchTap={this.onClickSend}/>
              </div>
            </div>
          ) : this.props.navInfo === 1 ? (
            <div className="lobbyContentWrapper">
              <div className="subtitleText animated bounce">
                Create Room
                <IconButton className="lobbyClose" style={exitIcon} onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
              </div>
              <div className="subtitleTextLiner"><hr/></div>
              <TextField floatingLabelText={this.state.modalSuccessMessage}
                       floatingLabelStyle={{color:'rgb(58, 210, 73)'}}
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
                  <div className="category categoryModal GAMES">GAMES</div>
                </label>
                <label className="btn btn-primary" id="mRadio3"
                       onClick={this.onRadioSelect}>
                  <input type="radio" autoComplete="off"/>
                  <div className="category categoryModal ANIME">ANIME</div>
                </label>
                <label className="btn btn-primary" id="mRadio4"
                       onClick={this.onRadioSelect}>
                  <input type="radio" autoComplete="off"/>
                  <div className="category categoryModal LOGOS">LOGOS</div>
                </label>
                <label className="btn btn-primary" id="mRadio5"
                       onClick={this.onRadioSelect}>
                  <input type="radio" autoComplete="off"/>
                  <div className="category categoryModal TRAVEL">TRAVEL</div>
                </label>
              </div> {/* End of Radio */}
              <div className="subtitleTextLiner"><hr/></div>
              <RaisedButton label="Create" secondary={true} fullWidth={true}
                            className="roomCreateBtn"
                            onTouchTap={this.onRoomCreation}/>
            </div>
          ) : this.props.lobbyInfo === null ? (
          <div className="lobbyContentWrapper">
            <div className="subtitleText animated bounce">Join Room</div>
            <div className="subtitleTextLiner"><hr/></div>
            <div className="paperWrapper animated zoomIn">
              <Paper style={lobbymenu} className="pulse1" zDepth={2}>
                <button className="pulse1"
                        onClick={this.renderHandler}
                        id='b1'>BY<br/>TOPIC</button>
              </Paper>
              <Paper style={lobbymenu} className="pulse1" zDepth={2}>
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
            <div className="subtitleText animated bounce">
              Select a Topic
              <IconButton className="lobbyClose" style={exitIcon} onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
            </div>
            <div className="subtitleTextLiner"><hr/></div>
            <div className="categoryWrapper">
              <div className="category categoryAni TV" onClick={this.topicJoin}>TV</div>
              <div className="category categoryAni GAMES" onClick={this.topicJoin}>GAMES</div>
              <div className="category categoryAni ANIME" onClick={this.topicJoin}>ANIME</div>
              <div className="category categoryAni LOGOS" onClick={this.topicJoin}>LOGOS</div>
              <div className="category categoryAni TRAVEL" onClick={this.topicJoin}>TRAVEL</div>
            </div>
            <div className="errorMessage">{this.state.errorMessage}</div>
          </div>
        ) : this.props.lobbyInfo === 'b3' ? (
          <div className="lobbyContentWrapper2">
            <div className="subtitleText animated bounce">
              Enter Room Name
              <IconButton className="lobbyClose" style={exitIcon} onTouchTap={this.renderHandlerClose}><NavigationClose /></IconButton>
            </div>
            <div className="subtitleTextLiner"><hr/></div>
            <TextField floatingLabelText={this.state.modalSuccessMessage}
                       hintText="Enter room name here..."
                       floatingLabelStyle={{ top: '25px', color:'rgb(58, 210, 73)'}}
                       errorText={this.state.modalErrorMessage}
                       fullWidth={true}
                       className='joinRoomInput'
                       onChange={this.onRoomName}
                       value={this.state.roomName}/>
            <RaisedButton label="Join" secondary={true} fullWidth={true}
                          className="joinRoomBtn"
                          onTouchTap={this.onJoinExistingRoom}/>
          </div>
        ) : null}


          {/* chat part */}
          {this.props.noticeNum > 0 ? (
            <Badge badgeContent={this.props.noticeNum}
                   primary={true}
                   key={uuid()}
                   className='chatBadge animated bounce'
                   style={badgeStyle}/>
          ) : null}
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
            <AppBar iconElementLeft={<FontIcon className="material-icons"
                                               color="white"
                                               style={{marginTop:'10px'}}>people</FontIcon>}
                    iconElementRight={<IconButton><NavigationClose onTouchTap={this.handleClose}/></IconButton>}
                    iconClassNameLeft='chatLeftIconNone'
                    title={this.state.onlineUsersCount}
                    />
            <div className="chatInputGroup">
              <TextField floatingLabelText="messages..."
                         fullWidth={true}
                         onChange={this.onChangeChat}
                         onKeyPress={this.onKeypressChat}
                         value={this.state.chatmsg} autoFocus
                         id="gloablChatInput"/>
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
      lobbyInfo: state.lobby,
      noticeNum: state.notice,
      sound: state.soundStatus
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
    },
    updateNotice: (notice) => {
      dispatch(updateNotice(notice))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
