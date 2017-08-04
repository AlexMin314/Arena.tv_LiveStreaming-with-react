import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';

// Import API
import { clickSoundPlay } from '../../API/utilityAPI';

// Import CSS
import './Signup.css';

// Import UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const inputStyle = {
  marginBottom: '20px'
}


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
      },
      passwordError:''
    }
  }

  // Event listener for Email and Password input fields
  uepInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      passwordError: '',
      error: {
        message:''
      }
    })
  }

  // Event listener for Sign Up button
  signup = (e) => {
    e.preventDefault();
    if (this.props.sound) clickSoundPlay()
    let noErrors = true;
    // Passwords match validation
    if(this.state.password !== this.state.confirmPassword) {
      noErrors = false;
      this.setState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        passwordError: 'Passwords do not match'});
    }

    // Getting email and password from state
    const {email, password} = this.state;

    if(noErrors) {
      // Create firebase user with email and password
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(error => {
          this.setState({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            error
          });
        })
    }

    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        // Set the reference to the users object in firebase
        const usersRef = firebaseDB.ref('users');

        // store all received auth info in variables
        const {username, email} = this.state;
        const userId = user.uid;
        const localUser = {
          displayName: username,
          email: email,
          photo: 'http://www.perlworkshop.nl/nlpw2016/img/default-avatar.png'
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
          <div className="signupWrapper">
            <h2 className="signUpTitle">Sign Up</h2>
            USERNAME
            <TextField hintText="username"
                       name="username"
                       style={inputStyle}
                       onChange={this.uepInput}
                       value={this.state.username}
                       errorText=''/>
            EMAIL
            <TextField hintText="email"
                       name="email"
                       style={inputStyle}
                       onChange={this.uepInput}
                       value={this.state.email}
                       errorText={this.state.error.message.includes('Password') ? null : this.state.error.message}/>
            PASSWORD
            <TextField hintText="password"
                       type="password"
                       name="password"
                       style={inputStyle}
                       onChange={this.uepInput}
                       value={this.state.password}
                       errorText={this.state.error.message.includes('Password') ? this.state.error.message : null}/>
            CONFIRM PASSWORD
            <TextField hintText="password"
                       type="password"
                       name="confirmPassword"
                       style={inputStyle}
                       onChange={this.uepInput}
                       value={this.state.confirmPassword}
                       errorText={this.state.passwordError}/>
            <RaisedButton label="sign up"
                          className="signupButton"
                          onTouchTap={this.signup}
                          primary={true}/>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    sound: state.soundStatus
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
