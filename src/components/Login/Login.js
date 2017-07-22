import React, {Component} from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';

// Import CSS
import './Login.css';

// Import Child Component
import SocialBtn from './SocialBtn';

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
    const email = this.state.email;
    const password = this.state.password;
    firebase.auth()
      .signInWithEmailAndPassword(email, password)
      .catch(error => {
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
      <div className="container-fluid contentBody">
        <div className="singInContentWrapper">
          <div className="singInContent">
            <h2> Login </h2>
            <div className = "loginForm">
              Email<input type="text"
                          name="email"
                          onChange={this.emailpasswordInput}/>
              <br/>
              Password<input type="password"
                          name="password"
                          onChange={this.emailpasswordInput}/>
              <br/>
              <button className="btn btn-primary"
                      onClick={this.login}>Login</button>
            </div>
            <div className="goToSignUp">
              Don't have a MindTap account yet?<br/>
              <a href="/signup">Register Now</a>
            </div>
            <SocialBtn/>
          </div>
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
