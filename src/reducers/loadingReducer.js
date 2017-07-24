import { setLoading, getLoading } from '../API/loadingAPI';

const initialLoad = getLoading();

const loadingReducer = (state = initialLoad, action) => {

  switch (action.type) {
    case "UPDATE_LOADING_STATUS":

        return [action.isStillLoading]

        break;

    default:
        return state;
  }
}

export default loadingReducer;
