import Build, { BuildElementExtraOptionsDataType } from "../Build";

type ButtonType = 
  | "solid"
  | "solid-inverted"
  | "solid-indigo"
  | "solid_indigo-inverted"
  | "solid-light"
  | "outline"
  | "outline-indigo"
  | "outline-inverted"
  | "transparent"
  | "transparent-light"
  | "transparent-red"
  | "transparent-inverted"
  | "facebook"
  | "google"
  | "apple";


export default (attributes: Partial<{
  type: ButtonType;
  size: "l" | "s" | "m";
  text: string;
  icon: {
    size?: 16 | 24 | 32 | 40 | 56 | 80 | 104;
    type: string;
    color?: "adaptive" | "black" | "white" | "blue-50"; // add more colors
  };
}>, extraOptions?: BuildElementExtraOptionsDataType) => {
  const buttonClassList = [
    "sg-button",
    `sg-button--${attributes.type || "solid"}`,
    `sg-button--${attributes.size || "s"}`
  ];

  if (attributes.icon && !attributes.text)
    buttonClassList.push("sg-button--icon-only"); 


  let body = "";
  let buttonIcon = attributes.icon;

  if (buttonIcon) {
    body += `
      <span class="sg-button__icon">
        <div class="sg-icon sg-icon--${buttonIcon.color || "adaptive"} sg-icon--x${buttonIcon.size || 16}">
          <svg class="sg-icon__svg"><use xlink:href="#icon-${buttonIcon.type}"></use></svg>
        </div>
      </span>
    `;
  }

  if (attributes.text) body += `<span class="sg-button__text">${attributes.text}</span>`;

  return Build("button", {
    classList: buttonClassList,
    html: body
  }, extraOptions);
};