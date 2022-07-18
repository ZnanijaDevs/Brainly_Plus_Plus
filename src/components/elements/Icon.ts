import clsx from "clsx";
import type { IconPropsType, IconType } from "brainly-style-guide";
import CreateElement, { CommonElementPropsType } from "../CreateElement";

const SG = `sg-icon`;

export default function Icon({
  type, 
  color = "adaptive",
  size = 16,
  ...props
}: CommonElementPropsType<{
  size?: IconPropsType["size"];
  color?: IconPropsType["color"]; 
  type: IconType;
}>) {
  let iconClassName = clsx(
    SG,
    `${SG}--x${size}`,
    `${SG}--${color}`,
  );

  return CreateElement({
    tag: "div",
    className: iconClassName,
    extraClassName: props.className,
    children: `<svg class="sg-icon__svg"><use xlink:href="#icon-${type}"></use></svg>`,
    ...props
  });
}