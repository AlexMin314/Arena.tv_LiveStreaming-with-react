import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Userlist.css';

// Import child Components

/**
 * Login
 */
export class Userlist extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="container-fluid hidden-sm-down">
        <div id="userListWrapper">
          <div className="userSpotsLeft">
            <div className="spots">
              <div className="testUser row">
                <div className="" id="userPics"></div>
                <div className="">
                  <div id="profileName"></div>
                  <div id="gameInfo"></div>
                  <div id="curChance"></div>
                </div>
              </div>
            </div>
            <div className="spots">
            </div>
            <div className="spots">
            </div>
          </div>
          <div className="userSpotsRight">
            <div className="spots">
            </div>
            <div className="spots">
            </div>
            <div className="spots">
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(Userlist);
