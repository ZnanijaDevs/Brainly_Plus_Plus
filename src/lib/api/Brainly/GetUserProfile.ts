type UserDataInProfileType = {
  isOnline: boolean;
  onlineStatus: string;
  nick: string;
};

export default async (
  userId: number
): Promise<UserDataInProfileType> => {
  const r = await fetch(
    `/profil/__NICK__-${userId}?client=moderator-extension`
  );

  if (r.status === 410) throw Error(MESSAGES.accountDeleted);

  const text = await r.text();
  const doc = new DOMParser().parseFromString(text, "text/html");

  console.debug(doc);

  let onlineStatus = doc.querySelector(".personal_info .rank > span").textContent
    .trim()
    .replace("\n", " ");

  return {
    isOnline: /онлайн/.test(onlineStatus),
    onlineStatus,
    nick: doc.querySelector(".personal_info .ranking a").textContent
  };
};