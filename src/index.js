import React from 'react';
import ReactDOM from 'react-dom';

// Import components
import App from './components/App/App';

// Import CSS
import './index.css';
import './animation.scss';
import './animation.css';

// Import API
import { setUsers } from './API/userAPI';
import { setRoom } from './API/roomAPI';
import { setGame } from './API/gameAPI';
import { setTurn } from './API/turnAPI';
import { setLoading } from './API/loadingAPI';
import { setTimerStatus } from './API/timerAPI';
import { setNav } from './API/navAPI';
import { setLobby } from './API/lobbyAPI';
import { setSoundStatus } from './API/soundAPI';

import registerServiceWorker from './registerServiceWorker';

// Redux
import { Provider } from 'react-redux';
import { initStore } from './store/Store';

const store = initStore();

// Init Store
store.subscribe(() => {
  // This stuff happens everytime store is updated
  const state = store.getState();
  setUsers(state.user);
  setLoading(state.isStillLoading);
  setRoom(state.room);
  setGame(state.gameStart);
  setTurn(state.currentTurn);
  setTimerStatus(state.timerStatus);
  setNav(state.nav);
  setLobby(state.lobby);
  setSoundStatus(state.soundStatus);
})

// This dispatcher is for the flow of storing user login status.
// store.dispatch(getUser())

ReactDOM.render(
  <Provider store={store}>
  <App/>
</Provider>, document.getElementById('root'));
registerServiceWorker();
