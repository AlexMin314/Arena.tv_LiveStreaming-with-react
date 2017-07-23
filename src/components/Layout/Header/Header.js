import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

import {connect} from 'react-redux';

import './Header.css';

/**
 * Header
 */
export class Header extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {

    return (
      <nav className="navbar row">
        <a id="brandName" href="/">MindTap</a>
        <a id="signIn" href="/login">Sign In</a>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
