import Button from "@lib/styleguide/elements/Button";
import OpenTicket from "@shared/ModerationTicket";
import { disableButton, enableButton } from "@utils/ElementsVisibility";
import findQuestionIdInLink from "@utils/FindQuestionIdInLink";

const updateFeedItems = () => {
  for (let item of document.querySelectorAll(".brn-feed-items > div")) {
    if (item.querySelector(".moderate-button")) continue;

    item.querySelector(".brn-feed-item__points").append(
      Button({
        icon: { type: "settings" }
      }, {
        classList: ["moderate-button"],
        title: locales.moderate,
        onClick: async event => {
          const button = event.target as HTMLButtonElement;
          const taskLink = item.querySelector<HTMLLinkElement>(".brn-feed-item__content a");

          disableButton(button);

          await OpenTicket(findQuestionIdInLink(taskLink.href), {
            showFlashOnError: true
          });

          enableButton(button);
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