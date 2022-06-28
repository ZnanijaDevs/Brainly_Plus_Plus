import React from "react";
import { Icon, IconPropsType, IconType } from "brainly-style-guide";

type ButtonType = 
  | "solid"
  | "solid-inverted"
  | "solid-indigo"
  | "solid-indigo-inverted"
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
  | "apple"
  | "solid-peach"
  | "outline-green"
  | "solid-orange";

export default function AdaptiveButton(props: React.PropsWithChildren<
  Partial<{
    type: ButtonType;
    size: "xs" | "s" | "m" | "l";
    icon: {
      size?: IconPropsType["size"];
      type: IconType;
      color?: IconPropsType["color"];
    };
    title: string;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    visible: boolean;
    disabled: boolean;
    classList: string;
  }>
>) {
  let buttonClassNames = [
    "sg-button",
    `sg-button--${props.size || "s"}`,
    `sg-button--${props.type || "solid"}`
  ];

  if (props.icon && !props.children) buttonClassNames.push("sg-button--icon-only");
  if (props.visible === false) buttonClassNames.push("opacity-0");
  if (props.disabled) buttonClassNames.push("sg-button--disabled");

  if (props.classList) buttonClassNames.push(...props.classList);

  return (
    <button disabled={props.disabled} onClick={props.onClick} title={props.title} className={buttonClassNames.join(" ")}>
      {!!props.icon && <span className="sg-button__icon">
        <Icon size={props.icon.size || 16} type={props.icon.type} color={props.icon.color || "icon-black"} />
      </span>}
      {!!props.children && <span className="sg-button__text">
        {props.children}
      </span>}
    </button>
  );
}