export const setNotice = (notice) => {
    localStorage.setItem('notice', JSON.stringify(notice));
}

export const getNotice = () => {
  const noticeJSON = localStorage.getItem('notice');
  let notice = {};
  try {
    notice = JSON.parse(noticeJSON);
  } catch (e) {
    console.log("Error: Cound not decode preferences from localstorage");
  }
  return notice === null ? 0 : notice;
}
