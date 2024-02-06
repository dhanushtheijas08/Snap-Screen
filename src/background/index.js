async function checkLocalStorage() {
  const storedVal = await chrome.storage.local.get([
    "isRecording",
    "recordingType",
  ]);
  console.log("storedVal", storedVal);
  return [storedVal.isRecording || false, storedVal.recordingType || "tab"];
}

chrome.action.onClicked.addListener(async (tab) => {
  const [isRecording, recordingType] = await checkLocalStorage();

  if (!isRecording) {
    chrome.storage.local.set({ isRecording: true });
    chrome.tabs.sendMessage(tab.id, { action: "startRecording" });
  } else {
    chrome.storage.local.set({ isRecording: false });
    chrome.tabs.sendMessage(tab.id, { action: "stopRecording" });
  }
});
