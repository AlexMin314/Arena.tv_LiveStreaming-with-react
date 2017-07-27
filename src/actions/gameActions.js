// This Action for the flow of storing Game Starting Status.
export const updateGameStart = (checker) => {
  return {
    type: "UPDATE_GAME",
    checker
  }
}
