import React, { Component } from 'react';
import { connect } from 'react-redux';

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

// Import theme
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

const muiTheme = getMuiTheme({
  fontFamily: 'Quicksand',
  palette: {

  }
});


class App extends Component {

  render() {
    const userLoggedIn = getUsers()[0]; // Check if user is logged in by accessing local storage, returns undefined if user is not logged in
    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Layout>
              <Switch>
              <Route exact path="/" component={userLoggedIn ? Lobby : Home}/>
              <Route exact path='/signup' component={userLoggedIn ? Lobby : Signup}/>
              <Route exact path='/login' component={userLoggedIn ? Lobby : Login}/>
              <Route exact path='/room/:id' component={userLoggedIn ? Room : Home}/>
              <Route exact path='/lobby' component={userLoggedIn ? Lobby : Home}/>
            </Switch>
          </Layout>
        </MuiThemeProvider>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
