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

  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user;
      return (
        <div>
        {isLoggedIn.length>0 ?
          <nav className="navbarWrapper">
            <a id="brandName" href="/">MindTap <i className="fa fa-pencil" aria-hidden="true"></i></a>
            <div className="container greetingContainer">
            <h2 className="greeting"> Welcome {this.props.user[0].displayName ? this.props.user[0].displayName : this.props.user[0].username}</h2>
            </div>
            <a id="logout" href="/" onClick={this.logout}>Log Out</a>
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
      }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
