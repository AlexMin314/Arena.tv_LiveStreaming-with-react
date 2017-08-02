import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import { connect } from 'react-redux';

// Import Actions
import { addUser } from '../../../actions/userActions';
import { isStillLoading } from '../../../actions/loadingActions';
import { updateTimerStatus } from '../../../actions/timerActions';

// Import Firebase
import firebase from '../../../firebase';
import { firebaseDB } from '../../../firebase';

// Import CSS
import './Header.css';

// Import UI
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

const iconStyles = {
  marginRight: 24,
};
const displayNone = {
  display: "none",
}

/**
 * Header
 */
export class Header extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)
  }

  // logout onClick event listener
  logout = () => {
    this.props.triggerLoading(false);
    this.props.updateTimer(null);
    // Remove user from firebase session
    firebase.auth().signOut().then(() => {
      // Remove user from local store
      this.props.setUserUpdate({});
    })
  }

  goHome = () => {
    window.location.href = '/';
  }

  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user[0];
      return (
        <div>
          <AppBar
            title={
              <div>
                <span onClick={this.goHome}>MindTap <i className="fa fa-pencil" aria-hidden="true"></i></span>
              </div>}
            iconElementLeft={null}
            iconStyleLeft={displayNone}
            iconElementRight={isLoggedIn ? <Logged logout={this.logout} /> : <Login />}
          />
        </div>
      );
  }
}

class Login extends Component {
  static muiName = 'FlatButton';

  render() {
    return (
      <FlatButton {...this.props} label="Sign In" href="/login" />
    );
  }
}

class Logged extends Component {

  constructor(props) {
    super(props)

  }
  static muiName = 'IconMenu';

  render() {
    return (
      <IconMenu
        {...this.props}
        iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" onTouchTap={this.props.logout}/>
      </IconMenu>
    );
  }
}



const mapStateToProps = (state) => {
  return {user: state.user}
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserUpdate: () => {
      dispatch(addUser())
    },
    triggerLoading: (result) => {
      dispatch(isStillLoading(result))
    },
    updateTimer: (timerStatus) => {
      dispatch(updateTimerStatus(timerStatus))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
