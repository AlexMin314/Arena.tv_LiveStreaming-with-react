import React, {Component} from 'react';
import {connect} from 'react-redux';

// Import React Router
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

// Import components
import Home from '../Home/Home';
import Layout from '../Layout/Layout'

// Import CSS
import './App.css';

class App extends Component {
  render() {
    return (

      <Router>
        <Layout>
          <Switch>
            <Route exact path="/" component={Home}/>
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
