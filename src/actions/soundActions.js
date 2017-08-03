// This Action for the flow of storing sound status.
export const updateSoundStatus = (soundStatus) => {
  return {
    type: "UPDATE_SOUND",
    soundStatus
  }
}
