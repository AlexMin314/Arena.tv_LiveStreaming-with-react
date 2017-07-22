import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './Footer.css';

/**
 * Login
 */
export class Footer extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)
  }

  render() {

    return (
      <div className="footer">
        <h5 className="footer-content-left">
          MindTap &hearts;<span> Alex . EL </span>
          All rights reserved 2017.</h5>
        <a className="footer-content-right" href="https://github.com/AlexMin314/MindTap-with-react-firebase">
          <i className="fa fa-github" aria-hidden="true"></i>Git Hub
        </a>
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

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
