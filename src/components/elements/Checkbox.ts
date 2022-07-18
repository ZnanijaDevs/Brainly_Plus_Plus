import generateRandomString from "@utils/generateRandomString";
import CreateElement, { CommonElementPropsType } from "../CreateElement";
import Icon from "./Icon";

export default function Checkbox({
  checked,
  id = `checkbox-${generateRandomString()}`,
  ...props
}: CommonElementPropsType<{ 
  checked: boolean;
  text?: string;
}>) {
  const checkboxChildren = [];

  const input = CreateElement({
    tag: "input",
    type: "checkbox",
    className: "sg-checkbox__element",
    id,
    checked: String(checked)
  });

  const checkboxGhost = CreateElement({
    tag: "div",
    className: "sg-checkbox__ghost",
    children: Icon({ type: "check" })
  });

  checkboxChildren.push(input, checkboxGhost);

  if (props.text) {
    checkboxChildren.push(
      CreateElement({
        tag: "span",
        className: "sg-text sg-text--small sg-text--bold",
        children: props.text
      })
    );
  }

  const label = CreateElement({
    tag: "label",
    className: "sg-checkbox",
    extraClassName: props.className,
    children: checkboxChildren,
    for: id,
    ...props
  });

  return label;
}