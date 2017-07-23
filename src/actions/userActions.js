// This Action for the flow of storing user login status.
export const addUser = (user) => {
  return {
    type: "ADD_USER",
    user
  }
}
