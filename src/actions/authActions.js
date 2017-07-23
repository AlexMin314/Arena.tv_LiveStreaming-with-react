// Authentication Actions

export const setCurrentUser = (user) => {
  return {
    type: "SET_CURRENT_USER",
    user
  };
}

export const logout = () => {
  return dispatch => {
    localStorage.removeItem('user');
    dispatch(setCurrentUser({}));
  }
}
