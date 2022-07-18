import CreateElement from "../CreateElement";

export default function Separator(
  type: "vertical" | "horizontal"
) {
  return CreateElement({
    tag: "div",
    className: `sg-${type}-separator`
  });
}