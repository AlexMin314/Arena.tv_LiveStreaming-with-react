// Import firebase database
import database from '../firebase';

// This Action for the flow of storing user login status.
const updateUser = (user) => {
  return {
    type: "USER_UPDATE",
    user
  }
}
