// This Action for the flow of storing user login status.
export const updateTimerStatus = (timerStatus) => {
  return {
    type: "UPDATE_TIMER",
    timerStatus
  }
}
