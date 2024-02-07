chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "startRecording") {
    createOverlay();
  } else if (request.action === "stopRecording") {
    removeOverlay();
  }
});

function createOverlay() {
  const overlay = document.createElement("div");
  overlay.id = "snap-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  overlay.style.zIndex = "9999";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.color = "white";

  // Add a "Start Recording" button
  const startRecordingButton = document.createElement("button");
  startRecordingButton.innerText = "Start Recording";
  startRecordingButton.style.fontSize = "18px";
  startRecordingButton.style.padding = "10px 20px";
  //   Emerald
  startRecordingButton.style.backgroundColor = "#059669";
  startRecordingButton.style.color = "white";
  startRecordingButton.style.border = "none";
  startRecordingButton.style.cursor = "pointer";
  startRecordingButton.style.borderRadius = "5px";
  startRecordingButton.addEventListener("click", startRecording);

  overlay.appendChild(startRecordingButton);

  document.body.appendChild(overlay);
}
function startRecording() {
  console.log("Recording started!");
  chrome.runtime.sendMessage({
    action: "contentScriptMessage",
    data: "Hello from content script!",
  });

  removeOverlay();
  // You may want to send a message to the background script to handle recording logic
}
function removeOverlay() {
  const overlay = document.querySelector("#snap-overlay");
  if (overlay) {
    overlay.remove();
  }
}
