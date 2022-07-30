import ext from "webextension-polyfill";

/** Show a flash message */
export const flash = (
  type: "info" | "error" | "success" | "default",
  text: string | Error,
  options?: Partial<{
    sticky: boolean;
    withIcon: boolean;
  }>
) => {
  if (typeof text !== "string")
    text = text.message;

  const flash = document.createElement("div");

  if (!options?.sticky) {
    flash.onclick = () => flash.remove();
    setTimeout(() => flash.remove(), 5000);
  }

  flash.classList.add("sg-flash");

  flash.innerHTML = `
    <div class="ext-flash-message sg-flash__message sg-flash__message--${type}">
      <div class="sg-text sg-text--small sg-text--bold sg-text--to-center">
        ${text}
      </div>
    </div>
  `;

  if (options?.withIcon) {
    flash.querySelector(".ext-flash-message").insertAdjacentHTML("afterbegin", `
      <img style="width: 23px; margin-right: 8px" src="${ext.runtime.getURL("icons/icon-black.png")}">
    `);
  }

  const flashesContainerOnPage = [
    ".moderation-ticket-flashes-container",
    ".flash-messages-container"
  ];

  for (let container of flashesContainerOnPage) {
    if (document.querySelector(container)) {
      document.querySelector(container).appendChild(flash);
      break;
    }
  }
};