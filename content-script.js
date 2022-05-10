chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.operation) {
    case "clipboard":
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(request.pageInfo).then(() => {
          sendResponse();
        });
        return true;
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = request.pageInfo;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        sendResponse();
      }
      break;
    case "searchSelectedString":
      sendResponse({ selection: window.getSelection().toString() });
      break;
    default:
      sendResponse();
  }
});
