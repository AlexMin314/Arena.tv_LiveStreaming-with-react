import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';

// Import CSS
import './Login.css';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: ''
    }
  }

  // Event listener for Email and Password input fields
  emailpasswordInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })

  }

  // Event listener for Login button
  login = (e) => {
    var email = this.state.email;
    var password = this.state.password;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(error => {

        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('error code: ',errorCode);
        console.log('error message: ',errorMessage)
        console.log('Signed in successfully!')
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row loginHeader">
          <div className="col-md-12">
            <h2> Login </h2>
          </div>
        </div>

        <div className = "loginForm">
        Email<input type="text"
                    name="email"
                    onChange={this.emailpasswordInput}
                    />
        Password<input type="password"
                    name="password"
                    onChange={this.emailpasswordInput}
                    />
        <button className="btn btn-primary"
                onClick={this.login}>Login</button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
