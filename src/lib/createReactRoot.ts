import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";

export default (
  parent?: HTMLElement
) => {
  const element = document.createElement("div");

  element.id = "extension-react-app-root";
  (parent || document.body).appendChild(element);

  const root = createRoot(element);

  return {
    root,
    render: (app: ReactNode) => root.render(app)
  };
};