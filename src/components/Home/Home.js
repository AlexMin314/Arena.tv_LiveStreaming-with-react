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

  onClick = (e) => {
    e.preventDefault();
    window.location.href = '/login';
  }

  render() {
    return (
      <div className="container-fluid contentBody">
        <div className="row homeContent">
          <div className="col-md-7 col-sm-12 brandWrapper">
            <div className="brandName">MindTap <i className="fa fa-pencil" aria-hidden="true"></i></div>
            <div className="introText">
                Etiam porta sem malesuada magna mollis euismod.
              Curabitur blandit tempus porttitor. Etiam porta sem
              malesuada magna mollis euismod. Curabitur blandit tempus porttitor.
            </div>
            <div className="joinBtn"
                 onClick={this.onClick}>Sign in</div>
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
