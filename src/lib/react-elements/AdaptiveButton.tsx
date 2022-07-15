import React, { useState } from "react";
import { Icon, IconPropsType, IconType } from "brainly-style-guide";

import Flash from "@utils/flashes";

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
  | "solid-orange"
  | "outline-peach"
  | "solid-green";

type AdaptiveButtonPropsType = React.PropsWithChildren<
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
>;

const createButtonClassList = (props: AdaptiveButtonPropsType): string => {
  let buttonClassNames = [
    "sg-button",
    `sg-button--${props.size || "s"}`,
    `sg-button--${props.type || "solid"}`
  ];

  if (props.icon && !props.children) buttonClassNames.push("sg-button--icon-only");
  if (props.visible === false) buttonClassNames.push("opacity-0");
  if (props.disabled) buttonClassNames.push("sg-button--disabled");

  if (props.classList) buttonClassNames.push(...props.classList.split(" "));

  return buttonClassNames.join(" ");
};

export default function AdaptiveButton(props: AdaptiveButtonPropsType) {
  const [loading, setLoading] = useState(false);

  let buttonClassList = createButtonClassList(props);
  if (loading) buttonClassList += " sg-button--disabled sg-button--loading";

  let onClickListener: typeof props.onClick = null;
  if (props.onClick) {
    onClickListener = async e => {
      setLoading(true);

      try {
        await props.onClick(e);
      } catch (err) {
        Flash("error", err);
      } finally {
        setLoading(false);
      }
    };
  }

  return (
    <button disabled={props.disabled || loading} onClick={onClickListener} title={props.title} className={buttonClassList}>
      {loading && 
        <div className="sg-spinner sg-spinner--xxsmall sg-button__spinner" />
      }
      {!!props.icon && <span className="sg-button__icon">
        <Icon size={props.icon.size || 16} type={props.icon.type} color={props.icon.color || "icon-black"} />
      </span>}
      {!!props.children && <span className="sg-button__text">
        {props.children}
      </span>}
    </button>
  );
}