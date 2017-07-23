import React, {Component} from 'react';
import {connect} from 'react-redux';

// Import firebase
import {firebaseDB} from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';

// Import CSS
import './Login.css';

// Import Child Component
import SocialBtn from './SocialBtn';

class Login extends Component {

  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
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
    e.preventDefault();
    const {email, password} = this.state;
    // Log in via firebase, initialise user session
    firebaseDB.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({
          email: '',
          password: '',
          error});
      })
    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebaseDB.auth().onAuthStateChanged(user => {
      if(user) {
        // add user to local store if successfully logged in to firebase
        this.props.addUser(user.uid);
      } else {
      console.log('no user is signed in');
      }
    })
  }

  render() {
    return (
      <div className="container-fluid contentBody">
        <div className="singInContentWrapper">
          <div className="singInContent">
            <h2> Login </h2>
            <div className="errors"><h3 className="errorMessage">{this.state.error.message}</h3></div>
            <div className = "loginForm">
            Email<input type="text"
                        name="email"
                        onChange={this.emailpasswordInput}
                        value={this.state.email}
                        className="form-control"
                        placeholder="Enter Email"/>
            <br/>
            Password<input type="password"
                        name="password"
                        onChange={this.emailpasswordInput}
                        value={this.state.password}
                        className="form-control"
                        placeholder="Enter Password"/>
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
  return {
    addUser: (user) => {
      dispatch(addUser(user))
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
