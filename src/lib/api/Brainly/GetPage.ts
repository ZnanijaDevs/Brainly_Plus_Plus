export default async (
  path: string
): Promise<Document> => {
  const r = await fetch(`${path}?client=moderator-extension`, {
    method: "GET",
    credentials: "include"
  });

  if (r.status === 410) throw Error(locales.deleted);

  const text = await r.text();
  const doc = new DOMParser().parseFromString(text, "text/html");

  return doc;
};