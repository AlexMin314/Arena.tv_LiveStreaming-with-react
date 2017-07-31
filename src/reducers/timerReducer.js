import { getTimerStatus, setTimerStatus } from '../API/timerAPI';

const initialTimerStatus = getTimerStatus();

const timerReducer = (state = initialTimerStatus, action) => {

  switch (action.type) {
    case "UPDATE_TIMER":
      return action.timerStatus
      break;

    default:
      return state;
  }
}

export default timerReducer;
