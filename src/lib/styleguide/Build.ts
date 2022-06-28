type BuildElementOptionsDataType = {
  classList: string[];
  html: string;
};

type BuildElementExtraOptionsDataType = Partial<{
  classList: string[];
  title: string;
  onClick: GlobalEventHandlers["onclick"];
}>;

export default function Build(
  tag: keyof HTMLElementTagNameMap,
  options: BuildElementOptionsDataType,
  extraOptions?: BuildElementExtraOptionsDataType
) {
  const element = document.createElement(tag);

  element.classList.add(...options.classList);

  if (extraOptions?.classList?.length) element.classList.add(...extraOptions.classList);

  element.innerHTML = options.html;

  if (extraOptions?.title) element.title = extraOptions?.title;
  element.onclick = extraOptions?.onClick;

  return element;
}

export { BuildElementExtraOptionsDataType };