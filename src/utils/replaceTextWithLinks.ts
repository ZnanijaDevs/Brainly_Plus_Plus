const LATEX_SERVICE_URL = "//tex.z-dn.net";

export default (
  content: string
): string =>
  content
    .replace(/\[tex\].*?\[\/tex\]/gims, (latex: string) => {
      latex = latex
        .replace(/\[\\?\/?tex\]/g, "")
        .replace(/ +/g, " ")
        .replace(/&amp;/g, "&");

      return `<img class="latex" src="${LATEX_SERVICE_URL}/?f=${encodeURIComponent(latex)}" />`;
    })
    .replace(/https?:\/{1,}.+?(?=\s|$)/gims, (link: string) => {
      const decodedURL = decodeURI(link);

      return `
        <a class="sg-text sg-text--link sg-text--inherited sg-text--bold sg-text--text-blue-60" target="_blank" href="${link}">
          ${decodedURL}
        </a>
      `;
    });