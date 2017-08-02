import { getLobby, setLobby } from '../API/lobbyAPI';

const initialLobby = getLobby();

const lobbyReducer = (state = initialLobby, action) => {

  switch (action.type) {
    case "UPDATE_LOBBY":
      return action.status
      break;

    default:
      return state;
  }
}

export default lobbyReducer;
