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
              {/* Testing Purpose */}
              <div className="userCardLeft row">
                <div className="userPicsLeft"></div>
                <div className="">
                  <div className="profileNameLeft"></div>
                  <div className="gameInfoLeft"></div>
                  <div className="curChanceLeft"></div>
                </div>
              </div>
              {/* Testing Purpose */}
              <div className="chatDisplayLeft arrow_box_left">hey, This is chat postion testing</div>
            </div>
            <div className="spots">
              {/* Testing Purpose */}
              <div className="userCardLeft row">
                <div className="userPicsLeft"></div>
                <div className="">
                  <div className="profileNameLeft"></div>
                  <div className="gameInfoLeft"></div>
                  <div className="curChanceLeft"></div>
                </div>
              </div>
            </div>
            <div className="spots">
            </div>
          </div>
          <div className="userSpotsRight">
            <div className="spots">
              {/* Testing Purpose / Need to rightside layout */}
              <div className="userCardRight row">
                <div className="userCardInfoRightWrapper">
                  <div className="profileNameRight"></div>
                  <div className="gameInfoRight"></div>
                  <div className="curChanceRight"></div>
                </div>
                <div className="userPicsRight"></div>
              </div>
              {/* Testing Purpose */}
              <div className="chatDisplayRight arrow_box_right">hey, This is chat postion testing</div>              
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
