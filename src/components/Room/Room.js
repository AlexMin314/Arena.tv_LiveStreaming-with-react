import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Room.css';

// Import child Components
import Userlist from './Userlist/Userlist';
import Chat from './Chat/Chat';

/**
 * Login
 */
export class Room extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row roomContent">
          <div className="col-lg-3 col-md-2 hidden-sm-down sectionWrapper">
          </div>
          <div className="col-lg-6 col-md-8 sectionWrapper">
            <div id="centerWrapper">
              <div id="infoBoard">header</div>
              <canvas id="whiteBoard"></canvas>
              <div id="toolBoard">header</div>
              <div id="btnSection">header</div>
            </div>
          </div>
          <div className="col-lg-3 col-md-2 hidden-sm-down sectionWrapper">
          </div>
          <Chat/>
          <Userlist/>
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

export default connect(mapStateToProps, mapDispatchToProps)(Room);
