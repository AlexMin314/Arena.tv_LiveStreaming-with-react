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
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

const iconStyles = {
  marginRight: 24,
};
const displayNone = {
  display: "none",
}
const avatar = {

}
const appBarStyle = {

}
const icon = {
  color: 'white'
}

/**
 * Header
 */
export class Header extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)

    this.state = {
      sound: true
    }
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
    setTimeout(() => {
      window.location.href = '/';
    }, 300)
  }

  goHome = () => {
    window.location.href = '/';
  }

  toggleSound = (e, logged) => {

    // tempral part
    this.setState({ sound: !this.state.sound })

    let defaultClick = document.getElementById('clicked');
    let socialClick = document.getElementById('mouseClicked');
    let mainMusic = document.getElementById('mainMusic');

    // Toggle sound off if value is false
    if(!logged) {
      defaultClick.muted = true;
      socialClick.muted = true;
      mainMusic.muted = true;
    } else {
      defaultClick.muted = false;
      socialClick.muted = false;
      mainMusic.muted = false;
    }
  }

  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user[0];
      return (
        <div>
          <AppBar
            title={
              <div>
                <span id='headerBrandName' onClick={this.goHome}>MindTap <i className="fa fa-pencil" aria-hidden="true"></i></span>
              </div>}
            iconElementLeft={null}
            iconStyleLeft={displayNone}
            className="appBar"
            style={appBarStyle}
            iconElementRight={isLoggedIn ? (
              <div className="headerWrapper">
                <Toggle
                  label={this.state.sound ? (
                    <FontIcon className="material-icons" color="white">volume_up</FontIcon>
                  ) : (
                    <FontIcon className="material-icons" color="white">volume_off</FontIcon>
                  )}
                  defaultToggled={true}
                  className="toggle"
                  onToggle={this.toggleSound}
                  labelPosition="left"
                  style={{display:'flex'}}
                  thumbSwitchedStyle={{backgroundColor: 'rgb(255, 64, 129)'}}
                  trackSwitchedStyle={{backgroundColor: 'rgb(252, 182, 224)'}}
                  labelStyle={{display:'flex', color:'white'}} />
                <div className="greetingWrapper">
                  <Avatar size="30"
                          className="avatarClass"
                          src={this.props.user[0].photo}
                          style={avatar} />
                  <div className="greeting">
                    Hi,{this.props.user[0].displayName}
                  </div>
                  <Logged logout={this.logout} />
                </div>
              </div>
            ) : (
              <Login />)}
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

  render() {
    return (
      <IconMenu
        {...this.props}
        iconButtonElement={<IconButton iconStyle={icon}><MoreVertIcon /></IconButton>}
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
