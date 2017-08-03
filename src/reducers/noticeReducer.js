import { getNotice, setNotice } from '../API/noticeAPI';

const initialNotice = getNotice();

const noticeReducer = (state = initialNotice, action) => {

  switch (action.type) {
    case "UPDATE_NOTICE":
      return action.notice
      break;

    default:
      return state;
  }
}

export default noticeReducer;
