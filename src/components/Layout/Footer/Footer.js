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
      <div className="footer container-fluid">
        <h5 className="footer-content-left hidden-xs-down">
          MindTap &hearts;<span> Alex . EL </span>
          All rights reserved 2017.</h5>
        <a className="footer-content-right hidden-xs-down"
           href="https://github.com/AlexMin314/MindTap-with-react-firebase">
           <i className="fa fa-github" id="git" aria-hidden="true"></i> Git Hub
        </a>
        <h5 className="footer-content-left hidden-sm-up">
          MindTap &hearts;<span> Alex . EL </span>
          All rights reserved 2017.</h5>
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
