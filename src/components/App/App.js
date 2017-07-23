import React, { Component } from 'react';
import { connect } from 'react-redux';
import { firebaseDB } from '../../firebase';

// Import React Router
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Import API
import { getUsers } from '../../API/userAPI';

// Import components
import Home from '../Home/Home';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import Lobby from '../Lobby/Lobby';
import Layout from '../Layout/Layout';
import Room from '../Room/Room';

// Import CSS
import './App.css';

firebaseDB.auth().onAuthStateChanged(user => {
  if(user) {
    console.log('user has signed in', user);
  } else {
    console.log('no user is signed in');
  }
})

class App extends Component {

  render() {
    const userLoggedIn = getUsers()[0]; // Check if user is logged in by accessing local storage, returns undefined if user is not logged in
    return (
      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={userLoggedIn ? Lobby : Home}/>
            <Route exact path='/signup' component={userLoggedIn ? Lobby : Signup}/>
            <Route exact path='/login' component={userLoggedIn ? Lobby : Login}/>
            <Route exact path='/room/:id' component={userLoggedIn ? Room : Home}/>
            {/* for development */}
            <Route exact path='/lobby' component={userLoggedIn ? Lobby : Home}/>
          </Switch>
        </Layout>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(App);
