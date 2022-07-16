import type { Warn } from "@typings/";
import GetPage from "./GetPage";

export default async (
  userId: number
) => {
  const doc = await GetPage(`/users/view_user_warns/${userId}`);

  const warns: Warn[] = [];

  for (let row of doc.querySelectorAll("tr")) {
    const fields = row.querySelectorAll("td");
    if (fields.length !== 7) continue;

    const warn = {} as Warn;
    warn.time = fields[0].innerText;
    warn.reason = fields[1].innerHTML;
    warn.content = fields[2].innerHTML;
    warn.taskId = parseInt(fields[3].querySelector("a")?.href.match(/\d+/)[0]);
    warn.warner = fields[4].innerText.trim();
    warn.active = !!fields[5].querySelector(`a[href*="cancel"]`);
    warn.contentType = fields[6].innerText.replace('\n', '').replace(' ', '');

    warns.push(warn);
  }

  return warns;
};