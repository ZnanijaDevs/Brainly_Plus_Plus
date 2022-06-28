import Button from "@lib/styleguide/elements/Button";
import OpenTicket from "@shared/ModerationTicket";
import { DisableButton, EnableButton } from "@utils/ElementsVisibility";
import FindQuestionIdInLink from "@utils/FindQuestionIdInLink";

const updateFeedItems = () => {
  for (let item of document.querySelectorAll(".brn-feed-items > div")) {
    if (item.querySelector(".moderate-button")) continue;
    
    item.querySelector(".brn-feed-item__points").append(
      Button({
        icon: { type: "settings" }
      }, {
        classList: ["moderate-button"],
        title: "Модерировать",
        onClick: async event => {
          const button = event.target as HTMLButtonElement;
          const taskLink = item.querySelector<HTMLLinkElement>(".brn-feed-item__content a");

          DisableButton(button);

          await OpenTicket(/*FindQuestionIdInLink(taskLink.href)*/49108350, {
            showFlashOnError: true
          });

          EnableButton(button);
        }
      })
    );
  }
};

const addObserverWhenFeedAvailable = () => {
  const target = document.getElementById("main-content");
  if (!target) return setTimeout(addObserverWhenFeedAvailable, 100);

  new MutationObserver(updateFeedItems).observe(target, {
    subtree: true,
    childList: true,
  });

  updateFeedItems();
};

addObserverWhenFeedAvailable();