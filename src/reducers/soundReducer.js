import { getSoundStatus, setSoundStatus } from '../API/soundAPI';

const initialSoundStatus = getSoundStatus();

const soundReducer = (state = initialSoundStatus, action) => {

  switch (action.type) {
    case "UPDATE_SOUND":
      return action.soundStatus
      break;

    default:
      return state;
  }
}

export default soundReducer;
