import React, {Component} from 'react';
import {connect} from 'react-redux';

// Import firebase
import {firebaseDB} from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';
import { isStillLoading } from '../../actions/loadingActions';

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
    this.props.triggerLoading(true);
    const {email, password} = this.state;
    // Log in via firebase auth
    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.props.triggerLoading(false);
        this.setState({
          email: '',
          password: '',
          error});
      })
    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const userRef = firebaseDB.ref('users/' + user.uid);
        userRef.on('value', (snapshot) => {
          const currentUser = snapshot.val();
          currentUser.id = user.uid;
        this.props.addUser(currentUser);
        this.props.triggerLoading(false);
        })

      } else {
        console.log('No user is signed in');
      }
    })
  }

  render() {
    return (
      <div className="container-fluid contentBody">
        { this.props.isStillLoading[0] && this.props.user.length === 0 ?
        (
          <div className="container-fluid spinner">
            <div className="cssload-loader">
            	<div className="cssload-inner cssload-one"></div>
            	<div className="cssload-inner cssload-two"></div>
            	<div className="cssload-inner cssload-three"></div>
            </div>
          </div>
        ) : (
            <div className="signInContentWrapper">
              <div className="signInContent">
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
            )
        }
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    isStillLoading: state.isStillLoading
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (user) => {
      dispatch(addUser(user))
    },
    triggerLoading: (result) => {
      dispatch(isStillLoading(result))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
