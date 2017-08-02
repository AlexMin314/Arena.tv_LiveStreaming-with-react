// Import Redux dependencies
import {createStore, compose, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

// Import reducers
import userReducer from '../reducers/userReducer';
import loadingReducer from '../reducers/loadingReducer';
import roomReducer from '../reducers/roomReducer';
import gameReducer from '../reducers/gameReducer';
import turnReducer from '../reducers/turnReducer';
import timerReducer from '../reducers/timerReducer';
import navReducer from '../reducers/navReducer';

export let initStore = () => {

  // Combine reducers
  const reducer = combineReducers({
    user: userReducer,
    isStillLoading: loadingReducer,
    room: roomReducer,
    gameStart: gameReducer,
    currentTurn: turnReducer,
    timerStatus: timerReducer,
    nav: navReducer
  });

  // Create the store with all the reducers and allow for chrome redux dev tools to run and read reducers
  const store = createStore(reducer, compose(
    applyMiddleware(thunk),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;

}
