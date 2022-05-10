const timeout = 200;
let tid = 0;

chrome.action.onClicked.addListener(() => {
  if (tid === 0) {
    tid = setTimeout(copyToClipBoard, timeout);
  } else {
    clearTimeout(tid);
    openTwitterWindow();
  }
});

async function copyToClipBoard() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  await chrome.tabs.sendMessage(tab.id, { operation: "clipboard", pageInfo: tab.title + "\n" + tab.url });
  tid = 0;
}

async function openTwitterWindow() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const window = await chrome.windows.getCurrent();
  const width = 680;
  const height = 410;
  const left = window.left + window.width - width - 25;
  const top = window.top + window.height - tab.height;
  const text = encodeURIComponent("\n\n" + tab.title + "\n" + tab.url);
  const url = `https://twitter.com/intent/tweet?text=${text}`;
  chrome.windows.create({ url, left, top, width, height, type: "popup" });
  tid = 0;
}

async function closeTabsInDirection(direction) {
  const allTabs = await chrome.tabs.query({ currentWindow: true });
  const currentTabIndex = allTabs.find((tab) => tab.active).index;
  const targetTabs = allTabs.filter(
    (tab) =>
      (direction === "right" && currentTabIndex < tab.index) || (direction === "left" && tab.index < currentTabIndex)
  );
  chrome.tabs.remove(targetTabs.map((tab) => tab.id));
}

async function duplicateCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.duplicate(tab.id);
}

async function searchSelectedString() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const { selection } = await chrome.tabs.sendMessage(tab.id, { operation: "searchSelectedString" });
  if (selection) {
    chrome.search.query({ disposition: "NEW_TAB", text: selection });
  }
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
    case "searchSelectedString":
      searchSelectedString();
      break;
  }
});
