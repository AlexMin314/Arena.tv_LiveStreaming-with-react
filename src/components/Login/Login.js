import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';
import { isStillLoading } from '../../actions/loadingActions';

// Import CSS
import './Login.css';

// Import API
import { clickSoundPlay, yaySoundPlay } from '../../API/utilityAPI';

// Import UI
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

// Import Child Component
import SocialBtn from './SocialBtn';

const inputStyle = {
  marginBottom: '20px'
}
const registerStyle = {
  color: 'rgb(255, 64, 129)'
}

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
    clickSoundPlay();
    setTimeout(() => {
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
    },100);
    }
  componentWillMount() {
    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebase.auth().onAuthStateChanged(user => {
      if(user && (user.providerData[0].providerId == "facebook.com" || user.providerData[0].providerId === "twitter.com" || user.providerData[0].providerId === "google.com")) {
        // Set the reference to the users object in firebase
        const usersRef = firebaseDB.ref('users');

        // store all received auth info in variables
        const email = user.providerData[0].email || '';
        const displayName = user.providerData[0].displayName;
        const photo = user.providerData[0].photoURL;
        const userId = user.uid;
        const fbtwUser = {
          email: email,
          displayName: displayName,
          photo: photo
        }

        // Listener for changes to users object
        usersRef.on('value',(snapshot) => {
          // get all the users by id from firebase
          console.log(snapshot);
          const users = snapshot.val();
          // Boolean to check if user exists in database
          let userExistsInDB = false;
          // Loop through users object to check if user exists
          for (let id in users) {
            if (userId == id) {
              console.log("Loop to check ID is running");
              userExistsInDB = true;
            }
          }

          // If user exists, just add the user to local storage
          if(userExistsInDB) {
            console.log("User Exists in Database");
            fbtwUser.id = userId;
            this.props.addUser(fbtwUser);
            this.props.triggerLoading(false);
          }

          // If user does not exist, add the user to database and local storage
          else{
            console.log("User does not Exist in Database, create new user");
            usersRef.child(userId).set(fbtwUser);
            this.props.addUser(fbtwUser);
            this.props.triggerLoading(false);
          }
        });

      } else {
        if(user) {
          const userRef = firebaseDB.ref('users/' + user.uid);
          userRef.on('value', (snapshot) => {
            const currentUser = snapshot.val();
            currentUser.id = user.uid;
          this.props.addUser(currentUser);
          this.props.triggerLoading(false);
          })
        }
      }
    })
  }

  // Helper Function to return a random number between a specified range
  getRandomIntInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  randomTip = () => {
    const tipsArray = ["Quick Tip: Use the \"Skip Turn\" button if you are not sure how to draw!", "Quick Tip: Use multiple colors for better illustration", "Quick Tip: Don\'t hesitate to guess whenever anything comes to mind", "Quick Tip: Points are given to the first person who answers correctly", "Quick Tip Don\'t be afraid to use more colors!", "Quick Tip: Use Quick Join to join a random game quickly", "Quick Tip: Keep track of the time remaining while you are drawing!", "Quick Tip: You can join your friend's room using the \"Join Existing\" button", "Quick Tip: Use the different line weights to add depth to your drawing", "Quick Tip: Be expressive in your drawings! Call forth your inner Rembrandt", "Quick Tip: Always keep the theme of what you are drawing in focus", "Quick Tip: Turn automatically changes every time a correct answer is given or when time runs out!", "Quick Tip: When the game is over, you can choose to play again or leave the room"];
    const randomNum = this.getRandomIntInRange(0,12);
    const returnedString = tipsArray[randomNum];
    return returnedString;
  }

  registerClick = () => {
    yaySoundPlay();
    setTimeout(() => {
      window.location.href = '/signup';
    }, 500)
  }

  render() {
    return (
      <div className="container-fluid contentBody">
        { this.props.isStillLoading[0] && this.props.user[0] === null ?
        (
          <div className="spinnerWrapper">
            <div className="cssload-loader">
            	<div className="cssload-inner cssload-one"></div>
            	<div className="cssload-inner cssload-two"></div>
            	<div className="cssload-inner cssload-three"></div>
            </div>
            <div className="advice">
              {this.randomTip()}
            </div>
          </div>
        ) : (
            <div className="signInContentWrapper">
              <div className="signInContent">
                <h2 className="signUpTitle">Sign In</h2>
                EMAIL
                <TextField hintText="enter email"
                           name="email"
                           style={inputStyle}
                           onChange={this.emailpasswordInput}
                           value={this.state.email}
                           errorText={this.state.error.message.includes('password') ? null : this.state.error.message}/>
                PASSWORD
                <TextField hintText="enter password"
                           type="password"
                           name="password"
                           style={inputStyle}
                           onChange={this.emailpasswordInput}
                           value={this.state.password}
                           errorText={this.state.error.message.includes('password') ? this.state.error.message : null}/>
                 <RaisedButton label="sign in"
                               className="signinButton"
                               onTouchTap={this.login}
                               primary={true}/>
                               {/* 'hvr-outline-out' */}
                <div className="goToSignUp">
                  Don't have a <span id="mindTapText">MindTap</span> account yet?
                  <FlatButton label="Register Now"
                              onTouchTap={this.registerClick}
                              style={registerStyle}
                              className="registerNow"
                              fullWidth={true} />
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
