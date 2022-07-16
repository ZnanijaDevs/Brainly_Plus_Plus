import type { UserBanTokensDataType } from "../Brainly/GetUserProfile";
import SendForm from ".";

export type BanType = 1 | 2 | 3 | 4 | 5 | 6;

export const BAN_TYPES = {
  1: { time: null, title: "Учебник", shortenedTitle: "У" },
  2: { time: 15 * 60, title: "15 минут", shortenedTitle: "15" },
  3: { time: 60 * 60, title: "60 минут", shortenedTitle: "60" },
  4: { time: 60 * 60 * 12, title: "12 часа", shortenedTitle: "12" },
  5: { time: 60 * 60 * 24, title: "24 часа", shortenedTitle: "24" },
  6: { time: 60 * 60 * 48, title: "48 часов", shortenedTitle: "48" },
};

export default async function BanUser(data: {
  userId: number;
  type: BanType;
}, tokens: UserBanTokensDataType) {
  return await SendForm(
    `/bans/ban/${data.userId}`,
    { "data[UserBan][type]": data.type },
    tokens
  );
}