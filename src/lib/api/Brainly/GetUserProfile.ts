import GetPage from "./GetPage";

export type UserActiveBanDataType = {
  type: string;
  givenBy: {
    link: string;
    nick: string;
  };
  expiresIn?: string;
};

export type UserBanTokensDataType = {
  key: string;
  lock: string;
  fields: string;
}

export type UserDataInProfileType = {
  id: number;
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
  ranks: string[];
  isModerator: boolean;
  isBanned: boolean;
  canBeBanned: boolean;
  activeBan?: UserActiveBanDataType;
  banTokens?: UserBanTokensDataType;
};

export default async (
  userId: number
): Promise<UserDataInProfileType> => {
  const doc = await GetPage(`/profil/__NICK__-${userId}`);

  let data = {} as UserDataInProfileType;

  let onlineStatus = doc.querySelector(".personal_info .rank > span").textContent
    .trim()
    .replace("\n", " ");

  let userNick = doc.querySelector(".personal_info .ranking a").textContent.trim();
  let userRanks = [...doc.querySelectorAll(".rank h3 a, .rank h3 > span")].map(e => 
    e.textContent.trim()
  );

  let moderationPanelText = doc.querySelector("#profile-mod-panel").textContent;

  let reportsCount = +moderationPanelText.match(/(?<=отмеченных нарушений\s)\d+/i);
  let wrongReportsCount = +moderationPanelText.match(/(?<=ошибочные заявки нарушений\s)\d+/i);
  let correctReportsPercent = (reportsCount - wrongReportsCount) / reportsCount * 100;

  let points = +doc.querySelector(".personal_info .points h1")
    .textContent
    .replace(/\s/g, "");

  let userAvatar = doc.querySelector<HTMLImageElement>(".personal_info .avatar img").src;
  if (!/static/.test(userAvatar)) userAvatar = "/img/avatars/100-ON.png";

  let userBanForm = doc.querySelector("#UserBanAddForm");
  let cancelBanLink = doc.querySelector(`a[href^="/bans/cancel"]`);

  data.isBanned = !!cancelBanLink;

  // Get user ban details
  if (cancelBanLink) {
    const banDetails = {} as UserActiveBanDataType;

    const liElement = cancelBanLink?.parentElement?.parentElement;

    banDetails.type = liElement.nextElementSibling
      ?.querySelector(".orange")
      ?.textContent;

    const moderatorLink = liElement.nextElementSibling
      ?.nextElementSibling
      ?.querySelector("a");

    banDetails.givenBy = {
      link: moderatorLink.href,
      nick: moderatorLink.textContent,
    };

    const expiresDateText = liElement.nextElementSibling
      ?.nextElementSibling?.nextElementSibling
      ?.querySelector(".orange")
      ?.textContent;

    if (expiresDateText) banDetails.expiresIn = expiresDateText;

    data.activeBan = banDetails;
  }

  // Find ban tokens
  if (userBanForm) {
    let userBanTokens = {} as UserBanTokensDataType;
  
    for (let tokenType of ["lock", "fields", "key"]) {
      let inputSelector = userBanForm.querySelector<
        HTMLInputElement
      >(`input[name="data[_Token][${tokenType}]"]`);

      userBanTokens[tokenType] = inputSelector.value;
    }

    data.banTokens = userBanTokens;
  }

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
    isModerator: userNick !== MESSAGES.accountDeleted && !userBanForm,
    canBeBanned: !!userBanForm,
    ranks: userRanks,
    id: userId
  };
};