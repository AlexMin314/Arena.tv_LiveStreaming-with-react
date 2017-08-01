import React, { Component } from 'react';
import { connect } from 'react-redux';

// Child components

// Import static files
import './Home.css';

//Import UI
import FlatButton from 'material-ui/FlatButton';


/**
 * App's Index Page
 */

const btnstyle = {
  height: '70px',
  width: '90%',
  fontSize: '20px',
  margin: '0 20px',
  border: '1px solid red'
};
const btnLabelStyle = {
  fontSize: '20px'
}
const stylePaper = {
  width: "420px",
  height: "420px",
  backgroundImage: "url('../../img/TV.png')"

};


export class Home extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {}
  }

  onSignIn = (e) => {
    e.preventDefault();
    window.location.href = '/login';
  }
  onSignUp = (e) => {
    e.preventDefault();
    window.location.href = '/signup';
  }

  render() {
    return (
      <div className="container-fluid contentBody">
        <div className="row homeContent">
          <div className="sectionSpliter"></div>
          <div className="brandWrapper">
            <div className="brandName">
              MindTap <i className="fa fa-pencil"
                         id="brandPencil"></i>
            </div>
            <div className="underLine hidden-xs-down ">
              want sketch line here
            </div>
            <div className="contentWapper">
              <div className="rightSideWrapper">
                <div className="introText">
                  " Pictionary on-the-go with a modern twist "
                </div>
                <div className="mainIconWrapper hidden-sm-up">
                  <i className="fa fa-gamepad fa-2x mainIcon" aria-hidden="true"></i>
                  <i className="fa fa-paint-brush fa-2x mainIcon" aria-hidden="true"></i>
                  <i className="fa fa-users fa-2x mainIcon" aria-hidden="true"></i>
                  <i className="fa fa-commenting fa-2x mainIcon" aria-hidden="true"></i>
                </div>
                <div className="mainIconWrapper hidden-xs-down hidden-md-up">
                  <div className="mainIconRow">
                    <i className="fa fa-gamepad fa-2x mainIcon" aria-hidden="true"></i>
                    <span className="mainIconText">Keep the guessing going and test your art skills!</span>
                  </div>
                  <div className="mainIconRow">
                    <i className="fa fa-paint-brush fa-2x mainIcon" aria-hidden="true"></i>
                    <span className="mainIconText">Pick from a kaleidoscope of colors to draw.</span>
                  </div>
                  <div className="mainIconRow">
                    <i className="fa fa-users fa-2x mainIcon" aria-hidden="true"></i>
                    <span className="mainIconText">Up to 6 players at once.</span>
                  </div>
                  <div className="mainIconRow">
                    <i className="fa fa-commenting fa-2x mainIcon" aria-hidden="true"></i>
                    <span className="mainIconText">Fastest finger first to score points.</span>
                  </div>
                </div>
                <div className="homeBtnWrapper animated infinite pulse">
                  <FlatButton label="Let's Play" primary={true}
                                style={btnstyle} onTouchTap={this.onSignIn}
                                labelStyle={btnLabelStyle}/>
                </div>
              </div>
              <div className="mainIconWrapper hidden-sm-down">
                <div className="mainIconRow">
                  <i className="fa fa-gamepad fa-2x mainIcon" aria-hidden="true"></i>
                  <span className="mainIconText">Keep the guessing going and test your art skills!</span>
                </div>
                <div className="mainIconRow">
                  <i className="fa fa-paint-brush fa-2x mainIcon" aria-hidden="true"></i>
                  <span className="mainIconText">Pick from a kaleidoscope of colors to draw.</span>
                </div>
                <div className="mainIconRow">
                  <i className="fa fa-users fa-2x mainIcon" aria-hidden="true"></i>
                  <span className="mainIconText">Up to 6 players at once.</span>
                </div>
                <div className="mainIconRow">
                  <i className="fa fa-commenting fa-2x mainIcon" aria-hidden="true"></i>
                  <span className="mainIconText">Fastest finger first to score points.</span>
                </div>
              </div>
            </div>
          </div>
          <div className="sectionSpliter"></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(Home);
