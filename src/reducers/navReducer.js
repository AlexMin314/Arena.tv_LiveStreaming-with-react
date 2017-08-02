import { getNav, setNav } from '../API/navAPI';

const initialNav = getNav();

const navReducer = (state = initialNav, action) => {

  switch (action.type) {
    case "UPDATE_NAV":
      return action.nav
      break;

    default:
      return state;
  }
}

export default navReducer;
