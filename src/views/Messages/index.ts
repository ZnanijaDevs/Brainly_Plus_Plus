import { Checkbox, Separator } from "@components";

class Messages {
  hideMessages = true;

  constructor() {
    this.RenderCheckbox();
    this.AddObserver();

    this.CheckMessages();
  }

  CheckMessages() {
    for (let message of $(".js-conversation")) {
      const messageText = message.querySelector(".js-message-content").textContent;
  
      message.hidden = (messageText.includes("\u00AD") && this.hideMessages);
    }
  }

  RenderCheckbox() {
    $(".brn-messages__conversations h2").append([
      Separator("vertical"),
      Checkbox({
        checked: true,
        text: locales.hideBans,
        onChange: (e) => {
          this.hideMessages = (e.target as HTMLInputElement).checked;
          this.CheckMessages();
        }
      })
    ]);
  }

  AddObserver() {
    const observer = new MutationObserver(this.CheckMessages.bind(this));

    observer.observe(
      document.querySelector(".js-conversations"),
      { childList: true }
    );
  }
}

new Messages();