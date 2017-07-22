import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './Lobby.css';

/**
 * Login
 */
export class Lobby extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div>
        <h1> LOBBY PAGE </h1>
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
