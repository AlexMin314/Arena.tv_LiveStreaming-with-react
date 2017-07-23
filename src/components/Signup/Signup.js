import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import firebase from '../../firebase.js';

// Import Actions
import { addUser } from '../../actions/userActions';

// Import CSS
import './Signup.css';

// Assign firebase database to variable
var database = firebase.database;

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: ''
    }
  }

  // Event listener for Email and Password input fields
  uepInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  // Event listener for Sign Up button
  signup = (e) => {
    var username = this.state.username;
    var email = this.state.email;
    var password = this.state.password;

    firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error code: ',errorCode);
        console.log('error message: ',errorMessage);
    });

    this.setState({
      username: '',
      email: '',
      password: ''
    })
  }

  render() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.addUser(user.uid);
      } else {
        console.log('user is not signed in');
      }
    });
    return (
      <div className="container-fluid contentBody">
        <div className="row signupContentWrapper">
          <div className="col-md-12">
            <h2> Sign Up </h2>
          </div>
          <div className = "loginForm">
              Username<input type="text"
                          name="username"
                          onChange={this.uepInput}
                          value={this.state.username}
                          className="inputField"/>
              Email<input type="text"
                          name="email"
                          onChange={this.uepInput}
                          value={this.state.email}
                          className="inputField"/>
              Password<input type="password"
                          name="password"
                          onChange={this.uepInput}
                          value={this.state.password}
                          className="inputField"/>
              <button className="btn btn-success"
                      onClick={this.signup}>Sign Up</button>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => {
      dispatch(addUser(user))
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
