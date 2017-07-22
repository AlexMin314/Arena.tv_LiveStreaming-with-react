import React, {Component} from 'react';
import {connect} from 'react-redux';

// Import React Router
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Import components
import Home from '../Home/Home';

// Import CSS
import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {user: state.user}
}

export default connect(mapStateToProps)(App);
