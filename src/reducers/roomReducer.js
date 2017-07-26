import { getRoom, setRoom } from '../API/roomAPI';

const initialRoom = getRoom();

const roomReducer = (state = initialRoom, action) => {

  switch (action.type) {
    case "UPDATE_ROOM":
      return action.room
      break;

    default:
      return state;
  }
}

export default roomReducer;
