import React, {Component} from 'react';
import {connect} from 'react-redux';

// Import firebase
import {firebaseDB} from '../../firebase';
import firebase from '../../firebase';

// Import Actions
import { addUser } from '../../actions/userActions';
import { isStillLoading } from '../../actions/loadingActions';

// Import CSS
import './SocialBtn.css';


class SocialBtn extends Component {
  constructor() {
    super();
    this.state = {
    }
  }

  // Facebook Login Onclick listener
  facebookLogin = () => {
    this.props.triggerLoading(true);
    // assign provider variable for facebook
    const provider = new firebase.auth.FacebookAuthProvider();
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

  // Twitter Login Onclick listener
  twitterLogin = () => {
    this.props.triggerLoading(true);
    // assign provider variable for twitter
    const provider = new firebase.auth.TwitterAuthProvider();
    // redirect to sign in with facebook via firebase
    firebase.auth().signInWithRedirect(provider);

    // catch the result of facebook login
    firebase.auth().getRedirectResult().then(result => {
      if (result.credential) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = result.credential.accessToken;
        const secret = result.credential.secret;
        // ...
      }
      // The signed-in user info.
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

  // Google Login Onclick listener
  googleLogin = () => {
    this.props.triggerLoading(true);
    // assign provider variable for twitter
    const provider = new firebase.auth.GoogleAuthProvider();
    // Pop up for google login
    firebase.auth().signInWithPopup(provider).then(result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const token = result.credential.accessToken;
      // The signed-in user info.
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
            <a href="#" className="itwittter" title="Twitter" onClick={this.twitterLogin}><i className="fa fa-twitter" /></a>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a className="igoogle" title="Google+" onClick={this.googleLogin}><i className="fa fa-google-plus" /></a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
    isStillLoading: state.IsStillLoading
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

export default connect(mapStateToProps, mapDispatchToProps)(SocialBtn);
