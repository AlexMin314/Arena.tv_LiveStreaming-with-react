import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Chat.css';

// Import child Components

/**
 * Login
 */
export class Chat extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="container-fluid hidden-sm-down">
        <div id="chatWrapper">
          <div className="chatLeft">
            <div className='chatTestSpot'>
              <div className="testChat">hey</div>
            </div>
            <div className='chatTestSpot'></div>
            <div className='chatTestSpot'></div>
          </div>
          <div className="chatRight">
            <div className='chatTestSpot'></div>
            <div className='chatTestSpot'></div>
            <div className='chatTestSpot'></div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
