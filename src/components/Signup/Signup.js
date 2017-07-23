import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Import firebase
import {firebaseDB} from '../../firebase';

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
    if(this.state.password !== this.state.confirmPassword) {
      this.setState({error: {message: 'Passwords do not match'} });
    }

    const {email, password} = this.state;
    firebaseDB.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          error});
      })
    // var username = this.state.username;
    // var email = this.state.email;
    // var password = this.state.password;
    // var confirmPassword = this.state.confirmPassword;
    //
    // firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
    //     // Handle Errors here.
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     console.log('error code: ',errorCode);
    //     console.log('error message: ',errorMessage);
    // });
    //
    // this.setState({
    //   username: '',
    //   email: '',
    //   password: ''
    // })
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

Signup.propTypes = {
  userSignupRequest: React.PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    userSignupRequest: (user) => {
      dispatch(addUser(user))
      }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup);
