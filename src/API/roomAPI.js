export const setRoom = (room) => {
    localStorage.setItem('room', JSON.stringify(room));
}

export const getRoom = () => {
  const roomJSON = localStorage.getItem('room');
  let room = {};
  try {
    room = JSON.parse(roomJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return room;
}
