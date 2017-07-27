import { getGame, setGame } from '../API/gameAPI';

const initialGame = getGame();

const gameReducer = (state = initialGame, action) => {

  switch (action.type) {
    case "UPDATE_GAME":
      return action.checker
      break;

    default:
      return state;
  }
}

export default gameReducer;
