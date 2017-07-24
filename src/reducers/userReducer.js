import {getUsers, removeUser} from '../API/userAPI';

const initialUser = getUsers();

const userReducer = (state = initialUser, action) => {

  switch (action.type) {
    case "ADD_USER":
      return [action.user]
      break;
    case "REMOVE_USER":
      return removeUser()
      break;
    default:
      return state;
  }
}

export default userReducer;
