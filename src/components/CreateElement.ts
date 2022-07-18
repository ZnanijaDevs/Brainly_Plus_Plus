/* eslint-disable @typescript-eslint/ban-types */
import AddChildren, { ElementChildrenType } from "./AddChildrenToElement";

const ALLOWED_ELEMENT_ATTRIBUTES = [
  "title", "for", "type", "id", "checked"
] as const;

type AllowedElementAttributeType = typeof ALLOWED_ELEMENT_ATTRIBUTES[number];

export type CommonElementPropsType<E = {}> = E & {
  className?: string;
} & Partial<{
  [x in AllowedElementAttributeType]: unknown;
}> & Partial<{
  onClick: (e: Event) => void;
  onChange: (e: Event) => void;
}>;

export default function CreateElement<
  T extends keyof HTMLElementTagNameMap
>({
  tag, children = [], className, extraClassName, ...props
}: {
  tag: T;
  className?: string;
  children?: ElementChildrenType;
  extraClassName?: string;
} & CommonElementPropsType) {
  const element = document.createElement<T>(tag);

  if (className) element.className = className;
  if (extraClassName) element.className += extraClassName;

  Object.entries(props).forEach(([name, value]) => {
    if (ALLOWED_ELEMENT_ATTRIBUTES.includes(name as AllowedElementAttributeType)) {
      element.setAttribute(name, value as string);
    } else if (name.startsWith("on") && typeof value === "function") {
      element[name.toLowerCase()] = value;
    }
  });

  AddChildren(element, children);

  return element;
}