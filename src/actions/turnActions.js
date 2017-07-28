// Action for updating current turn after game starts
export const updateCurrentTurn = (index) => {
  return {
    type: "UPDATE_TURN",
    index
  }
}
