chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (window.isSecureContext && navigator.clipboard) {
    navigator.clipboard.writeText(request.message).then(() => {
      sendResponse();
    });
    return true;
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = request.message;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    sendResponse();
  }
});
