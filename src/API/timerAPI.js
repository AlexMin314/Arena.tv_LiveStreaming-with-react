export const setTimerStatus = (timerStatus) => {
    localStorage.setItem('timerStatus', JSON.stringify(timerStatus));
}

export const getTimerStatus = () => {
  const timerJSON = localStorage.getItem('timerStatus');
  let timerStatus = {};
  try {
    timerStatus = JSON.parse(timerJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return timerStatus;
}
