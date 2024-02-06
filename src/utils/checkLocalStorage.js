export async function checkLocalStorage() {
  const storedVal = await chrome.storage.local.get([
    "isRecording",
    "recordingType",
  ]);
  return [storedVal.isRecording || false, storedVal.recordingType || "tab"];
}
