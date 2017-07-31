import React, { Component } from 'react';
import { connect } from 'react-redux';

// Child components

// Import static files
import './Home.css';

/**
 * App's Index Page
 */
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
          <div className="col-lg-6 col-md-7 col-9 brandWrapper">
            <div className="brandName">
              MindTap <i className="fa fa-pencil" aria-hidden="true"></i>
            </div>
            <div className="introText">
                <h2>"Pictionary on-the-go with a modern twist"</h2>
            </div>
            <div className="taglineText">
                <h4 className="tagline">Keep the guessing going and test your art skills!</h4>
            </div>
            <div className="featuresText">
                <ul>
                  <li>5 Categories to choose from</li>
                  <li>Pick from a kaleidoscope of colors to draw</li>
                  <li>Up to 6 players at once</li>
                  <li>Fastest finger first to score points</li>
                  <li>Guess before the time runs out</li>
                </ul>
            </div>
            <div className="mainIconWrapper">
              <i className="fa fa-paint-brush fa-2x mainIcon" aria-hidden="true"></i>
              <i className="fa fa-users fa-2x mainIcon" aria-hidden="true"></i>
              <i className="fa fa-commenting fa-2x mainIcon" aria-hidden="true"></i>
              <i className="fa fa-gamepad fa-2x mainIcon" aria-hidden="true"></i>
            </div>
            <div className="row">
              <button type="button"
                      className="btn btn-primary"
                      id="mainSignInBtn"
                      onClick={this.onSignIn}>SIGN IN</button>
              <div id="OR"> OR </div>
              <button type="button"
                      className="btn btn-primary"
                      id="mainSignInBtn"
                      onClick={this.onSignUp}>SIGN UP</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(Home);
