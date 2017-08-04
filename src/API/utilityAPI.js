// Helper Function to return a random number between a specified range
export const getRandomIntInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

const clicked = document.getElementById('clicked');
const clicked2 = document.getElementById('clicked2');
const mouseclicked = document.getElementById('mouseClicked');
const yay = document.getElementById('yay');


export const clickSoundPlay = () => {
  clicked.play();
}
export const clickSoundPlay2 = () => {
  clicked2.play();
}
export const mouseclickSoundPlay = () => {
  mouseclicked.play();
}
export const yaySoundPlay = () => {
  yay.play();
}


// registerClick = () => {
//   clickSoundPlay();
//   setTimeout(() => {
//     window.location.href = '/login';
//   }, 300)
// }


// Import API
// import { clickSoundPlay, yaySoundPlay } from '../../API/utilityAPI';
