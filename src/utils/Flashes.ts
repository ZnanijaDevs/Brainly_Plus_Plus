export default (
  type: "info" | "error" | "success" | "default",
  text: string | Error
) => {
  if (typeof text !== "string")
    text = text.message;

  const flash = document.createElement("div");

  flash.onclick = () => flash.remove();
  setTimeout(() => flash.remove(), 5000);

  flash.classList.add("sg-flash");

  flash.innerHTML = `
    <div class="sg-flash__message sg-flash__message--${type}">
      <div class="sg-text sg-text--small sg-text--bold sg-text--to-center">
        ${text}
      </div>
    </div>
  `;

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