import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from '../../firebase';

// Import React Router
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Import components
import Home from '../Home/Home';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Lobby from '../Lobby/Lobby';

// Import CSS
import './App.css';

class App extends Component {
  render() {
    const userLoggedIn = firebase.auth().currentUser;
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={userLoggedIn ? Lobby : Home}/>
          <Route exact path='/signup' component={userLoggedIn ? Lobby : Signup}/>
          <Route exact path='/login' component={Login}/>
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(App);
