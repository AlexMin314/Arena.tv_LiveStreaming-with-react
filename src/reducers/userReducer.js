import {getUsers} from '../API/userAPI';

const initialUser = getUsers();

const userReducer = (state = initialUser, action) => {

  switch (action.type) {
    case "ADD_USER":

      return [action.user]

      break;

    default:
      return state;
  }
}

export default userReducer;
