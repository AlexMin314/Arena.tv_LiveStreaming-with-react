import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './RoomList.css';

export class RoomList extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="roomList">
        {/* Temporal Room List for layout test*/}
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
        <div className="rooms"></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(RoomList);
