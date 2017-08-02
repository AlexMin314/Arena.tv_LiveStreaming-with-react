export const setLobby = (status) => {
    localStorage.setItem('status', JSON.stringify(status));
}

export const getLobby= () => {
  const statusJSON = localStorage.getItem('status');
  let status = {};
  try {
    status = JSON.parse(statusJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return status;
}
