import chalk from "chalk";
import cookies from "js-cookie";
import type { UserBanTokensDataType } from "../Brainly/GetUserProfile";

const INFOBAR_COOKIE = "Zadanepl_cookie[infobar]";

const FindErrorsInCookies = () => {
  const infoBarData = cookies.get(INFOBAR_COOKIE);
  if (!infoBarData) {
    chalk.red(`${INFOBAR_COOKIE} not found`);
    return;
  }

  const notifications: {
    class: string;
    layout: string;
    text: string;
  }[] = JSON.parse(atob(unescape(infoBarData)));

  for (const notification of notifications) {
    if (notification?.class === "failure") throw Error(notification.text);
  }

  cookies.remove(INFOBAR_COOKIE);
};

export default async function SendForm(
  url: string,
  data: Record<string, string | number>,
  tokens: UserBanTokensDataType
) {
  const form = new FormData();

  const body = {};

  body["data[_Token][fields]"] = tokens.fields;
  body["data[_Token][lock]"] = tokens.lock;
  body["data[_Token][key]"] = tokens.key;
  body["_method"] = "POST";

  Object.keys(data).forEach(key => body[key] = data[key]);

  // Set form body
  for (let fieldKey in body) {
    form.append(fieldKey, body[fieldKey].toString());
  }

  await fetch(`${url}?client=moderator-extension`, {
    method: "POST",
    body: form,
    credentials: "include",
    redirect: "manual",
  });

  return FindErrorsInCookies();
}