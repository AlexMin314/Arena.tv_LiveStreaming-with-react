import { getTurn, setTurn } from '../API/turnAPI';

const initialTurn = getTurn();

const turnReducer = (state = initialTurn, action) => {

  switch (action.type) {
    case "UPDATE_TURN":
      return action.index
      break;

    default:
      return state;
  }
}

export default turnReducer;
