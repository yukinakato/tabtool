const timeout = 200;
let tid = 0;

chrome.action.onClicked.addListener(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tid === 0) {
    tid = setTimeout(copyToClipBoard, timeout, tab);
  } else {
    clearTimeout(tid);
    openTwitterWindow(tab);
  }
});

async function copyToClipBoard(tab) {
  await chrome.tabs.sendMessage(tab.id, { message: tab.title + "\n" + tab.url });
  tid = 0;
}

function openTwitterWindow(tab) {
  chrome.windows.getCurrent({}, (window) => {
    const width = 680;
    const height = 410;
    const left = window.left + window.width - width;
    const top = window.top + window.height - tab.height;
    const text = encodeURIComponent("\n\n" + tab.title + "\n" + tab.url);
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    chrome.windows.create({ url, left, top, width, height, type: "popup" });
    tid = 0;
  });
}

async function closeTabsInDirection(direction) {
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const currentTabIndex = allTabs.find((tab) => tab.active).index;
  const targetTabs = allTabs.filter(
    (tab) =>
      (direction === "right" && currentTabIndex < tab.index) || (direction === "left" && tab.index < currentTabIndex)
  );
  targetTabs.forEach((tab) => {
    chrome.tabs.remove(tab.id);
  });
}

async function duplicateCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.duplicate(tab.id);
}

chrome.commands.onCommand.addListener((command) => {
  switch (command) {
    case "closeLeftTabs":
      closeTabsInDirection("left");
      break;
    case "closeRightTabs":
      closeTabsInDirection("right");
      break;
    case "duplicateCurrentTab":
      duplicateCurrentTab();
      break;
  }
});
