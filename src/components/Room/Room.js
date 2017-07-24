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
          <Chat/>
          <Userlist/>
          <div className="col-lg-6 col-md-8 sectionWrapper">
            <div id="centerWrapper">
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
              <canvas id="whiteBoard"></canvas>
              <div id="toolBoard">
                <div className="btn-group" data-toggle="buttons">
                  <label className="btn btn-primary active">
                    <input type="radio" id="colBlack" autoComplete="off" defaultChecked />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" id="colBlue" autoComplete="off" />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" id="colGreen" autoComplete="off" />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" id="colRed" autoComplete="off" />
                  </label>
                  <label className="btn btn-primary">
                    <input type="radio" id="colBlack" autoComplete="off" />
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
                        id="skipTurnBtn"
                        className="btn btn-primary">
                        Clear
                </button>
              </div>
              <div id="btnSection">Input</div>
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

    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Room);
