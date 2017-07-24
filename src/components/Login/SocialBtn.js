import React, { Component } from 'react';
import { connect } from 'react-redux';

// Import firebase
import { firebaseDB } from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';

// Import CSS
import './SocialBtn.css';


class SocialBtn extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  facebookLogin = () => {

    // assign provider variable for facebook
    var provider = new firebase.auth.FacebookAuthProvider();
    // redirect to sign in with facebook via firebase
    firebase.auth().signInWithRedirect(provider);
    // catch the result of facebook login
    firebase.auth().getRedirectResult().then((result) => {
      if (result.credential) {
        // Provides a Facebook Access Token which can be used to access the Facebook API.
        const token = result.credential.accessToken;
      }
      // The store the signed in user info in user variable
      const user = result.user;
    }).catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      const credential = error.credential;
      // ...
    });
  }

  componentWillMount() {
    // Firebase observer to listen if user has signed in
    // If signed in, fire off action to add user to local store
    firebase.auth().onAuthStateChanged(user => {
      if(user && user.providerData[0].providerId == "facebook.com") {
        console.log(user.providerData[0]);
        // Set the reference to the users object in firebase
        const usersRef = firebase.database().ref('users');

        // store all received auth info in variables
        var email = user.providerData[0].email || '';
        var displayName = user.providerData[0].displayName;
        var photo = user.providerData[0].photoURL;
        var userId = user.uid;
        const fbUser = {
          email: email,
          displayName: displayName,
          photo: photo
        }

        // Listener for changes to users object
        usersRef.on('value',(snapshot) => {
          // get all the users by id from firebase
          var users = snapshot.val();
          // Boolean to check if user exists in database
          var userExistsInDB = false;
          // Loop through users object to check if user exists
          for (var id in users) {
            if (userId == id) {
              userExistsInDB = true;
            }
          }

          // If user exists, just add the user to local storage
          if(userExistsInDB) {
            fbUser.id = userId;
            this.props.addUser(fbUser);
          }

          // If user does not exist, add the user to database and local storage
          else{
            usersRef.child(userId).set(fbUser);
            this.props.addUser(fbUser);
          }
        });

      } else {
      console.log('Sign in locally');
      }
    })
  }

  render() {

    return (
      <div className="row" id="SocialBtnWrapper">
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="ifacebook" title="Facebook" onClick={this.facebookLogin}><i className="fa fa-facebook" /></a>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="itwittter" title="Twitter"><i className="fa fa-twitter" /></a>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="igoogle" title="Google+"><i className="fa fa-google-plus" /></a>
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

export default connect(mapStateToProps, mapDispatchToProps)(SocialBtn);
