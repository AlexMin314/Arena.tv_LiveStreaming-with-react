import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './Lobby.css';

// Import child Components
import RoomList from './RoomList/RoomList';
import GlobalChat from './GlobalChat/GlobalChat';

/**
 * Login
 */
export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row lobbyContent">
          <div className="col-md-9 col-sm-8 lobbyLeftSection">
            {/* Left-Top Section */}
            <div className="col-md-12 filterSection">
              <div className="filterIcon" id='TV'></div>
              <div className="filterIcon" id='game'></div>
              <div className="filterIcon" id='IT'></div>
              <div className="filterIcon" id='sports'></div>
              <div className="filterIcon" id='travel'></div>
            </div>
            {/* Left-Middle Section */}
            <div className="col-md-12 roomListWrapper">
              <RoomList/>
            </div>
            {/* Left-Bottom Section */}
            <div className="col-md-12 bottomContentWrapper">
              <div className="col-sm-8 hidden-xs noticeSection">
                Notice & Welcom
              </div>
              <div className="col-sm-2 col-xs-6 createRoom">
                Create<br/>Room
              </div>
              <div className="col-sm-2 col-xs-6 quickJoin">
                Quick<br/>Join
              </div>
            </div>
          </div>
          {/* Right-Global Chat */}
          <div className="col-md-3 col-sm-4 hidden-xs lobbyRightSection">
            <GlobalChat/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Lobby);
