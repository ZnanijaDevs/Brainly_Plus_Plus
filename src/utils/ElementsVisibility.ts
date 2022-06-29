export const disableButton = (button: HTMLButtonElement) => {
  button.disabled = true;
  button.classList.add("sg-button--disabled", "sg-button--loading");

  button.innerHTML += `
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--gray-900 sg-spinner--xsmall"></div>
    </div>
  `;
};

export const enableButton = (button: HTMLButtonElement) => {
  button.disabled = false;
  button.classList.remove("sg-button--disabled", "sg-button--loading");

  button.querySelector(".sg-spinner-container__overlay").remove();
};