// This Action for the flow of storing user login status.
export const updateLobby = (status) => {
  return {
    type: "UPDATE_LOBBY",
    status
  }
}
