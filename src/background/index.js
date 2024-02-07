import { checkLocalStorage } from "../utils/checkLocalStorage";
let creating;

chrome.action.onClicked.addListener(async (tab) => {
  const [isRecording, recordingType] = await checkLocalStorage();

  if (!isRecording) {
    chrome.storage.local.set({ isRecording: true });
    sendMessageToTab({ action: "startRecording" });
  } else {
    chrome.storage.local.set({ isRecording: false });
    sendMessageToTab({ action: "stopRecording" });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "contentScriptMessage") {
    recordingProcess();
  }
});

const getTabId = (callback) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs.length > 0) {
      const tabId = tabs[0].id;
      callback(tabId);
    } else {
      callback(null);
    }
  });
};

const sendMessageToTab = (message) => {
  getTabId((tabId) => {
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message);
    } else {
      console.error("Tab ID is not available.");
    }
  });
};

const sentOffScreenMessage = async (streamId) => {
  await chrome.runtime.sendMessage({
    type: "start-recording",
    target: "offscreen",
    data: streamId,
  });
  console.log("message sent to offscreen");
};

const recordingProcess = async () => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  if (tabs && tabs.length > 0) {
    const tabId = tabs[0].id;

    // Setup our offscreen document
    const existingContexts = await chrome.runtime.getContexts({});
    const offscreenDocument = existingContexts.find(
      (c) => c.contextType === "OFFSCREEN_DOCUMENT"
    );

    if (!offscreenDocument) {
      // Create an offscreen document.
      await chrome.offscreen.createDocument({
        url: "./offscreen/offscreen.html",
        reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
        justification: "Recording from chrome.tabCapture API",
      });

      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tabId,
      });
      console.log("stream id", streamId);

      // Add a delay to allow the offscreen document to initialize
      // setTimeout(async () => {
      //   sentOffScreenMessage(streamId);
      // }, 2000);
      chrome.runtime.sendMessage({
        type: "start-recording",
        target: "offscreen",
        data: streamId,
      });
    } else {
      const streamId = await chrome.tabCapture.getMediaStreamId({
        targetTabId: tabId,
      });
      // console.log("stream id", streamId);
      console.log("offscreen document already exists");
      // // Send a message to the offscreen document
      // sentOffScreenMessage(streamId);
    }
  } else {
    console.error("No active tab found.");
  }
};

// async function setupOffscreenDocument(path) {
//   const offscreenUrl = chrome.runtime.getURL("./offscreen/offscreen.html");
//   const existingContexts = await chrome.runtime.getContexts({
//     contextTypes: ["OFFSCREEN_DOCUMENT"],
//     documentUrls: [offscreenUrl],
//   });

//   // create offscreen document
//   if (creating) {
//     await creating;
//   } else {
//     creating = await chrome.offscreen.createDocument({
//       url: "./offscreen/offscreen.html",
//       reasons: ["USER_MEDIA", "DISPLAY_MEDIA"],
//       justification: "Recording from chrome.tabCapture API",
//     });
//     creating = null;
//   }
// }
