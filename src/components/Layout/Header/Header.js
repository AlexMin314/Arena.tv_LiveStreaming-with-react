import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import { connect } from 'react-redux';

// Import Actions
import {removeUser} from '../../../actions/userActions';
import { isStillLoading } from '../../../actions/loadingActions';

// Import Firebase
import firebase from '../../../firebase';
import { firebaseDB } from '../../../firebase';

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
    this.props.triggerLoading(false);
    // Remove user from firebase session
    firebase.auth().signOut().then(() => {
      // Remove user from local store
      this.props.removeUser();

    }).catch(error => {

      console.log(error);
    });
  }

  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user;
      return (
        <div>
        {isLoggedIn.length>0 ?
          <nav className="navbarWrapper">
            <a id="brandName" href="/">MindTap <i className="fa fa-pencil" aria-hidden="true"></i></a>
            <a id="logout" href="/" onClick={this.logout}>Log Out</a>            
            <div className="greetingWrapper">
              <h5 className="greeting"> Welcome, {this.props.user[0].displayName ? this.props.user[0].displayName : this.props.user[0].username}</h5>
              <img className="userPhoto" src={this.props.user[0].photo}/>
            </div>
          </nav>
            :
          <nav className="navbarWrapper">
            <a id="brandName" href="/">MindTap <i className="fa fa-pencil" aria-hidden="true"></i></a>
            <a id="signIn" href="/login">Sign In</a>
          </nav>
        }
        </div>
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
    },
    triggerLoading: (result) => {
      dispatch(isStillLoading(result))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
