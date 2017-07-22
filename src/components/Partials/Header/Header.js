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
      <div>
        <h2>This is the header</h2>
      </div>
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
