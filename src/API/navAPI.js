export const setNav = (nav) => {
    localStorage.setItem('nav', JSON.stringify(nav));
}

export const getNav= () => {
  const navJSON = localStorage.getItem('nav');
  let nav = {};
  try {
    nav = JSON.parse(navJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return nav;
}
