// Import firebase database
import database from '../firebase';

// This Action for the flow of storing user login status.
export const addUser = (user) => {
  return {
    type: "ADD_USER",
    user
  }
}

export const getUser = () => {
  return (dispatch) => {

  };
}
