export type UserDataInProfileType = {
  avatar: string;
  points: number;
  isOnline: boolean;
  onlineStatus: string;
  nick: string;
  deleted: boolean;
  reportsCount: number;
  wrongReportsCount: number;
  correctReportsPercent: number;
  answersCount: number;
  questionsCount: number;
  warnsCount: number;
  registered: string;
  bestAnswersCount: number;
};

export default async (
  userId: number
): Promise<UserDataInProfileType> => {
  const r = await fetch(`/profil/__NICK__-${userId}?client=moderator-extension`, {
    method: "GET",
  });

  if (r.status === 410) throw Error(MESSAGES.accountDeleted);

  const text = await r.text();
  const doc = new DOMParser().parseFromString(text, "text/html");

  const data = {} as UserDataInProfileType;

  let onlineStatus = doc.querySelector(".personal_info .rank > span").textContent
    .trim()
    .replace("\n", " ");

  let userNick = doc.querySelector(".personal_info .ranking a").textContent.trim();

  let moderationPanelText = doc.querySelector("#profile-mod-panel").textContent;

  let reportsCount = +moderationPanelText.match(/(?<=отмеченных нарушений\s)\d+/i);
  let wrongReportsCount = +moderationPanelText.match(/(?<=ошибочные заявки нарушений\s)\d+/i);
  let correctReportsPercent = (reportsCount - wrongReportsCount) / reportsCount * 100;

  let points = +doc.querySelector(".personal_info .points h1")
    .textContent
    .replace(/\s/g, "");
  
  let userAvatar = doc.querySelector<HTMLImageElement>(".personal_info .avatar img").src;
  if (!/static/.test(userAvatar)) userAvatar = "/img/avatars/100-ON.png";

  return {
    ...data,
    points,
    reportsCount,
    wrongReportsCount,
    onlineStatus,
    nick: userNick,
    isOnline: /онлайн/.test(onlineStatus),
    deleted: userNick === MESSAGES.accountDeleted,
    avatar: userAvatar,
    answersCount: +moderationPanelText.match(/(?<=решенных задач:\s)\d+/i),
    warnsCount: +moderationPanelText.match(/(?<=предупреждений:\s)\d+/i),
    questionsCount: +moderationPanelText.match(/(?<=заданные задачи:\s)\d+/i),
    bestAnswersCount: +moderationPanelText.match(/(?<=лучшие решения:\s)\d+/i),
    registered: moderationPanelText.match(/(?<=зарегистрирован\s:\s).+/i).toString(),
    correctReportsPercent: Math.round(correctReportsPercent * 1e1) / 1e1,
  };
};