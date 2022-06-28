export const DisableButton = (button: HTMLButtonElement) => {
  button.disabled = true;
  button.innerHTML += `
    <div class="sg-spinner-container__overlay">
      <div class="sg-spinner sg-spinner--gray-900 sg-spinner--xsmall"></div>
    </div>
  `;
};

export const EnableButton = (button: HTMLButtonElement) => {
  button.disabled = false;
  button.querySelector(".sg-spinner-container__overlay").remove();
};