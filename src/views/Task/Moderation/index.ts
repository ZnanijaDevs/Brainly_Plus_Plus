import OpenTicket from "@shared/ModerationTicket";
import { disableButton, enableButton } from "@utils/ElementsVisibility";

export default () => {
  const intervalId = setInterval(() => {
    const oldButtons = $(".sg-button.sg-button--solid[title=модерировать]");
    if (!oldButtons.length) return;
  
    clearInterval(intervalId);
  
    const taskId = +window.location.href.match(/(?<=task\/)\d+/);
  
    for (let button of oldButtons) {
      const clonedButton = button.cloneNode(true);
  
      clonedButton.addEventListener("click", async function() {
        disableButton(this);
  
        await OpenTicket(taskId, {
          showFlashOnError: true
        });
    
        enableButton(this);
      });
  
      button.parentNode.replaceChild(clonedButton, button);
    }
  }, 100);

  (() => intervalId)();
};