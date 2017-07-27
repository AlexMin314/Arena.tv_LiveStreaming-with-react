// Action for updating current turn after game starts
export const updateCurrentTurn = (username) => {
  return {
    type: "UPDATE_TURN",
    username
  }
}
