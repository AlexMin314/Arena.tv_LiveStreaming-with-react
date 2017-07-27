export const setGame = (status) => {
    localStorage.setItem('gameStart', JSON.stringify(status));
}

export const getGame = () => {
  const gameJSON = localStorage.getItem('gameStart');
  let game = {};
  try {
    game = JSON.parse(gameJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return game;
}
