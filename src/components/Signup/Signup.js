import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';

// Import CSS
import './Signup.css';

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      error: {
        message: ''
      }
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
    e.preventDefault();

    let noErrors = true;
    // Passwords match validation
    if(this.state.password !== this.state.confirmPassword) {
      noErrors = false;
      this.setState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        error: {message: 'Passwords do not match'} });
    }

    // Getting email and password from state
    const {email, password} = this.state;

    // Create firebase user with email and password
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          error});
      })

    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        // Set the reference to the users object in firebase
        const usersRef = firebase.database().ref('users');

        // store all received auth info in variables
        const {username, email} = this.state;
        const userId = user.uid;
        const localUser = {
          username: username,
          email: email,
          photo: ''
        }

        // Listener for changes to users object
        usersRef.on('value',(snapshot) => {
          // get all the users by id from firebase
          const users = snapshot.val();
          // Boolean to check if user exists in database
          let userExistsInDB = false;
          // Loop through users object to check if user exists
          for (var id in users) {
            if (userId == id) {
              userExistsInDB = true;
            }
          }

          // If user exists, just add the user to local storage
          if(userExistsInDB) {
            localUser.id = userId;
            this.props.addUser(localUser);
          }

          // If user does not exist, add the user to database and local storage
          else{
            usersRef.child(userId).set(localUser);
            this.props.addUser(localUser);
          }
        });
      } else {
        console.log('no user is signed in');
      }
    })
  }

  render() {

    return (
      <div className="container-fluid contentBody">
        <div className="row signupContentWrapper">
          <div className="col-md-12">
            <h2>Sign Up</h2>
            <div className="errors"><h3 className="errorMessage">{this.state.error.message}</h3></div>
          </div>
          <div className="form">
            <div className="form-group">
              Username<input type="text"
                          name="username"
                          onChange={this.uepInput}
                          value={this.state.username}
                          className="form-control"
                          placeholder="Enter Username"/>
              Email<input type="text"
                          name="email"
                          onChange={this.uepInput}
                          value={this.state.email}
                          className="form-control"
                          placeholder="Enter Email"/>
              Password<input type="password"
                          name="password"
                          onChange={this.uepInput}
                          value={this.state.password}
                          className="form-control"
                          placeholder="Enter Password"/>
              Confirm Password<input type="password"
                          name="confirmPassword"
                          onChange={this.uepInput}
                          value={this.state.confirmPassword}
                          className="form-control"
                          placeholder="Retype password"/>
              <button className="btn btn-primary signupButton"
                      onClick={this.signup}>Sign Up</button>
            </div>
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
