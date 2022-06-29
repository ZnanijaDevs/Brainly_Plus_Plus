import type { QuestionLogEntry, UserDataType } from "@typings/Brainly";
import createProfileLink from "@utils/createProfileLink";

export type EntriesByDateDataType = {
  [x: string]: QuestionLogEntry[];
}

export default (
  entries: QuestionLogEntry[],
  usersData: UserDataType[]
): EntriesByDateDataType => {
  let entriesByDate: EntriesByDateDataType = {};

  entries.forEach(entry => {
    let date = entry.date;

    let textPieces = entry.text
      .split(/(%\d\$s)/)
      .map(piece => {
        if (piece !== "%1$s" && piece !== "%3$s") return piece;

        let user = usersData.find(
          userData => userData.id === entry[piece === "%1$s" ? "user_id" : "owner_id"]
        );
      
        let userLink = createProfileLink(user.id, user.nick);
        return `
          <a class="sg-text sg-text--small sg-text--link sg-text--bold" target="_blank" href="${userLink}">
            ${user.nick}
          </a>
        `;
      });

    if (entry.class === "deleted") {
      let deletionReason = "Причина"; // TODO: get short deletion reason
  
      if (deletionReason) 
        textPieces.push(
          `как <span class="sg-text sg-text--inherited sg-text--bold">${deletionReason}</span>`
        );
  
      if (entry.warn)
        textPieces.push(` 
          <span class="sg-text sg-text--inherited sg-text--bold sg-text--text-red-60">
            ${MESSAGES.withWarn}
          </span>`
        );
    }

    entry.text = textPieces.join("");
    entriesByDate[date] = (entriesByDate[date] || []).concat(entry);
  });

  return entriesByDate;
};