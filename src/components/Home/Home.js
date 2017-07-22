import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

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

  render() {
    return (
      <div className="container-fluid contentBody">
        <div className="row homeContent">
          <div className="leftSection col-sm-6 row">
            <div className="brandWrapper">
              <div className="brandName">MindTap</div>
              <div className="introText">
                Etiam porta sem malesuada magna mollis euismod.
                Curabitur blandit tempus porttitor. Etiam porta sem
                malesuada magna mollis euismod. Curabitur blandit tempus porttitor.
              </div>
              <div className="joinBtn">Sign up / Sign in</div>
            </div>
          </div>
          <div className="rightSection col-sm-6">Right Section</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(Home);
