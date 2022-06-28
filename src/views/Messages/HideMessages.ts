/*(function () {
  let hideMessages = function () {
    for (let thr of document.querySelectorAll('li.thread')) {
      let lastMessage = thr.querySelector('div.last-message').innerHTML;
      if (lastMessage[0] == "\u00AD") {
        thr.style.display = "none";
      }
    }
    for (let thr of document.querySelectorAll('li.js-private-massage')) {
      let lastMessage = thr.querySelector('.sg-media__content:last-child').innerHTML.trim();
      if (lastMessage[0] == "\u00AD") {
        thr.style.display = "none";
      }
    }
    const notifications = document.querySelector(".dock-box > div:nth-child(2)");
    if (notifications && !document.URL.includes('messages'))
      for (let thr of notifications.querySelectorAll("li")) {
        let lastMessageElement = thr.querySelector('.sg-media__content:last-child');
        if (lastMessageElement && lastMessageElement.innerText.trim()[0] == "\u00AD") {
          thr.style.display = "none";
        } 
      }
  }

  setInterval(hideMessages, 200);
})();*/