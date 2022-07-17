import { BanType, BAN_TYPES } from "@lib/api/BrainlyForms/BanUser";

const random = (arr: string[]) => {
  let len = arr?.length;
  if (len > 0) return arr[Math.floor(len * Math.random())];
};

export default (data: {
  deleteAccount: boolean;
  reason: string;
  reasonText: string;
  banType: BanType
}) => {
  const elements = System.banMessage;

  let banData = BAN_TYPES[data.banType];
  let message = {};

  if (data.deleteAccount) {
    message["header"] = elements.accountWillBeDeleted;
    message["banReminder"] = "";
  } else if (banData.time) {
    message["header"] = `Вам дан бан ${banData.title}.\n`;
  } else {
    message["header"] = "";
  }

  if (data.reason && banData.time) message["header"] += `Причина: ${data.reason}.\n`;

  let text = random(elements.greetings) + message["header"] + data.reasonText + random(elements.endings);

  return text;
};