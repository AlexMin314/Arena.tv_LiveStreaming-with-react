export const setSoundStatus = (soundStatus) => {
    localStorage.setItem('soundStatus', JSON.stringify(soundStatus));
}

export const getSoundStatus = () => {
  const soundJSON = localStorage.getItem('soundStatus');
  let soundStatus = {};
  try {
    soundStatus = JSON.parse(soundJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return soundStatus;
}
