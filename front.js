chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.operation) {
    case 'clipboard':
      if (window.isSecureContext && navigator.clipboard) {
        navigator.clipboard.writeText(request.text)
      } else {
        const textarea = document.createElement('textarea')
        textarea.style.position = 'fixed'
        textarea.style.opacity = '0'
        textarea.value = request.text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
      }
      sendResponse()
      break

    case 'getSelection':
      sendResponse({ selection: window.getSelection().toString() })
      break

    default:
      sendResponse()
  }
})
