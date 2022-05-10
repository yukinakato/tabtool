const timeout = 200;
let tid = 0;
let tab = null;

chrome.action.onClicked.addListener(async () => {
  if (tid === 0) {
    [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tid = setTimeout(copyToClipBoard, timeout);
  } else {
    clearTimeout(tid);
    openTwitterWindow();
  }
});

async function copyToClipBoard() {
  await chrome.tabs.sendMessage(tab.id, { message: tab.title + "\n" + tab.url });
  tid = 0;
  tab = null;
}

function openTwitterWindow() {
  chrome.windows.getCurrent({}, (window) => {
    const width = 680;
    const height = 410;
    const left = window.left + window.width - width;
    const top = window.top + window.height - tab.height;
    const text = encodeURIComponent("\n\n" + tab.title + "\n" + tab.url);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    chrome.windows.create({ url, left, top, width, height, type: "popup" });
    tid = 0;
    tab = null;
  });
}
