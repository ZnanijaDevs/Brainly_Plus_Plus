import CreateElement from "./CreateElement";

export type ElementChildrenType = 
  | string
  | number
  | boolean
  | Text
  | Element
  | HTMLElement
  | DocumentFragment
  | Node
  | ElementChildrenType[]
  | null;

export default function AddChildrenToElement(
  parent: ReturnType<typeof CreateElement>,
  children: ElementChildrenType
) {
  if (children instanceof Array) {
    children.forEach(_child => AddChildrenToElement(parent, _child));
    return;
  }
  
  if (
    typeof children === "string" ||
    typeof children === "number" ||
    typeof children === "boolean"
  )
    parent.insertAdjacentHTML("beforeend", children.toString());
  else if (
    children instanceof Text ||
    children instanceof Element ||
    children instanceof HTMLElement ||
    children instanceof DocumentFragment ||
    children instanceof Node
  )
    parent.append(children);
}