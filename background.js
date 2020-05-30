let tid = 0;
let timeout = 200;

function copyCb(tab) {
  let input = document.createElement("textarea");
  let str = tab[0].title + "\n" + tab[0].url;
  document.body.appendChild(input);
  input.value = str;
  input.select();
  document.execCommand("Copy");
  document.body.removeChild(input);
  tid = 0;
}

function openTwitter(tab) {
  chrome.windows.getCurrent({ populate: false }, function (w) {
    let pos_left = w.left + w.width - 540;
    let pos_top = w.top + w.height - tab[0].height;
    // let enc_title = encodeURIComponent(tab[0].title);
    // let enc_url = encodeURIComponent(tab[0].url);
    // let openurl = `https://twitter.com/intent/tweet?text=${enc_title}&url=${enc_url}`;
    let enc_text = encodeURIComponent("\n\n" + tab[0].title + "\n" + tab[0].url);
    let openurl = `https://twitter.com/intent/tweet?text=${enc_text}`;
    let features = `width=540,height=360,left=${pos_left},top=${pos_top},scrollbars=yes,resizable=yes,toolbar=no,location=no`;
    window.open(openurl, "_blank", features);
    tid = 0;
  });
}

chrome.browserAction.onClicked.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    if (tid === 0) {
      tid = setTimeout(copyCb, timeout, tab);
    } else {
      clearTimeout(tid);
      openTwitter(tab);
    }
  });
});
