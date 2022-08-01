import ext from "webextension-polyfill";
import storage from "@lib/storage";

export default async ({ date, content }: {
  date: string;
  content: string;
}) => {
  content = content
    .replace(/\r?\n?(відповідь|ответ|пояснення|(пошаговое\s)?объяснение):/gi, "")
    .replace(/<\/?\w+\s?\/?>/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  const splittedDate = date.split("T")[0].split("-");

  let searchEngine = await storage.get("searchEngine");
  let url;

  if (searchEngine === "yandex") {
    let encodedQuery = encodeURIComponent(`"${content}" date<${splittedDate.join("")}`);
    url = `https://yandex.ru/search/?text=${encodedQuery}`;
  } else {
    let d = new Date(splittedDate.join("/"));
    d.setDate(d.getDate() - 1);

    let formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

    url = encodeURI(
      `https://google.com/search?q="${content}"&tbs=cdr:1,cd_min:,cd_max:${formattedDate}`
    );
  }
  
  ext.tabs.create({ url });
};