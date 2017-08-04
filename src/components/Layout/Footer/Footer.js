import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Footer.css';

// import actions
import { updateNav } from '../../../actions/navActions';
import { updateLobby } from '../../../actions/lobbyActions';
import { updateNotice } from '../../../actions/noticeActions';

// Import API
import { clickSoundPlay, mouseclickSoundPlay } from '../../../API/utilityAPI';

// import UI
import FontIcon from 'material-ui/FontIcon';
import { BottomNavigation, BottomNavigationItem } from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const recentsIcon = <FontIcon className="material-icons">input</FontIcon>;
const favoritesIcon = <FontIcon className="material-icons">home</FontIcon>;
const nearbyIcon = <FontIcon className="material-icons">chat</FontIcon>;

/**
 * Login
 */
export class Footer extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props)

    this.state = {
      selectedIndex: 0,
    }
  }

  select = (index) => {
    this.setState({selectedIndex: index});
    this.props.navUpdating(index);
    this.props.updateLobby(null);
    if (this.props.sound) clickSoundPlay();
    if (index === 2) this.props.updateNotice(0);
  }

  render() {

    return (
      <div>
      {!this.props.user[0] ? (
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
      ) : this.props.lobbyInfo !== 'room' ? (
        <Paper zDepth={1}>
          <BottomNavigation selectedIndex={this.props.navInfo}>
            <BottomNavigationItem
              label="Join Room"
              icon={recentsIcon}
              onTouchTap={() => this.select(0)}
            />
            <BottomNavigationItem
              label="Create Room"
              icon={favoritesIcon}
              onTouchTap={() => this.select(1)}
            />
            <BottomNavigationItem
              label="Chat"
              icon={nearbyIcon}
              className="bottomChat"
              onTouchTap={() => this.select(2)}
            />
          </BottomNavigation>
        </Paper>
      ) : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
      navInfo: state.nav,
      startInfo: state.gameStart,
      lobbyInfo: state.lobby,
      sound: state.soundStatus
    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    navUpdating: (nav) => {
      dispatch(updateNav(nav))
    },
    updateLobby: (status) => {
      dispatch(updateLobby(status))
    },
    updateNotice: (status) => {
      dispatch(updateNotice(status))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
