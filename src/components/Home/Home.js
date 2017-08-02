import React, { Component } from 'react';
import { connect } from 'react-redux';


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
    let clicked = document.getElementById('clicked');
    clicked.play();
    setTimeout(() => {window.location.href = '/login'},50);
  }
  onSignUp = (e) => {
    e.preventDefault();
    window.location.href = '/signup';
  }

  componentDidMount() {
    let mainMusic = document.getElementById('mainMusic');
    mainMusic.play();
    mainMusic.loop = true;
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
                  <a className="btn-draw" id="mainStartBtn" onClick={this.onSignIn} href="#"><span>Let's Play</span></a>
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
