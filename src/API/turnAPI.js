export const setTurn = (status) => {
    localStorage.setItem('currentTurn', JSON.stringify(status));
}

export const getTurn = () => {
  const turnJSON = localStorage.getItem('currentTurn');
  let turn = {};
  try {
    turn = JSON.parse(turnJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return turn;
}
