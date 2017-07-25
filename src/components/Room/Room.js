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
          {/* Chat & User Grid */}
          <UserlistChat room={this.state.room}/>

          <div className="col-lg-3 col-md-2 hidden-sm-down sectionWrapper">
          </div>
          {/* Center Board Section */}
          <div className="col-lg-6 col-lg-offset-3 col-md-8 col-md-offset-2 sectionWrapper">
            <div id="centerWrapper">
              {/* Info Section */}
              <div id="infoBoard">
                <div id="whosTurn">
                  Painter: NameHere {/* need to get username of the turn*/}
                </div>
                <div id="turnMasterWrapper">
                  <div id ="keyword">
                    keywordHere
                  </div>
                  <button type="button"
                          id="skipTurnBtn"
                          className="btn btn-primary">
                          Skip Turn
                  </button>
                </div>
              </div>
              {/* Canvas Section */}
              <canvas id="whiteBoard"></canvas>
              {/* Tool Section */}
              <div id="toolBoard">
                <div className="btn-group colorPicker" data-toggle="buttons">
                  <label className="btn btn-primary active" id="colorTool">
                    <input type="radio" autoComplete="off" defaultChecked />
                    <div id ="colBlack"></div>
                  </label>
                  <label className="btn btn-primary" id="colorTool">
                    <input type="radio" id="colBlue" autoComplete="off" />
                    <div id ="colBlue"></div>
                  </label>
                  <label className="btn btn-primary" id="colorTool">
                    <input type="radio" autoComplete="off" />
                    <div id ="colGreen"></div>
                  </label>
                  <label className="btn btn-primary" id="colorTool">
                    <input type="radio" autoComplete="off" />
                    <div id ="colRed"></div>
                  </label>
                  <label className="btn btn-primary" id="colorTool">
                    <input type="radio" autoComplete="off" />
                    <div id ="colYellow"></div>
                  </label>
                </div>
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn btn-primary active">
                    <input type="radio" name="options" id="option1" autoComplete="off" defaultChecked />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" name="options" id="option2" autoComplete="off" />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" name="options" id="option3" autoComplete="off" />
                  </label>
                </div>
                <button type="button"
                        id="clearBtn"
                        className="btn btn-primary">
                        Clear
                </button>
                <button type="button"
                        id="leaveBtn"
                        className="btn btn-primary"
                        onClick={this.leaveRoom}>
                        Leave Room
                </button>
              </div>
              {/* Input & Btn Section */}
              <div id="inputSection">
                <div className="input-group">
                  <input type="text"
                         className="form-control"
                         placeholder="Type Messages..."
                         value={this.state.msg}
                         onChange={this.onChangeChat}/>
                  <span className="input-group-btn">
                    <button className="btn btn-secondary"
                            type="button"
                            onClick={this.sendChat}>Send</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-2 hidden-sm-down sectionWrapper">
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

export default connect(mapStateToProps, mapDispatchToProps)(Room);
