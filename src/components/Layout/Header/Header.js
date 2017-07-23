import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import {connect} from 'react-redux';

// Import Actions
import {removeUser} from '../../../actions/userActions';

// Import Firebase
import {firebaseDB} from '../../../firebase';

// Import CSS
import './Header.css';

/**
 * Header
 */
export class Header extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
    this.state = {}
  }

  // logout onClick event listener
  logout = () => {
    // Remove user from firebase session
    firebaseDB.auth().signOut().then(() => {
      // Remove user from local store
      this.props.removeUser();
    }).catch(error => {
      console.log(error);
    });
  }

  componentDidMount() {
    console.log(this.props.user);
  }

  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user;
      return (
        <nav className="navbarWrapper">
        <a id="brandName" href="/">MindTap <i className="fa fa-pencil" aria-hidden="true"></i></a>
        {isLoggedIn.length>0 ?
            <a id="logout" href="/" onClick={this.logout}>Log Out</a> : <a id="signIn" href="/login">Sign In</a>
        }
      </nav>
      );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

const mapDispatchToProps = (dispatch) => {
  return {
    removeUser: () => {
      dispatch(removeUser())
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
