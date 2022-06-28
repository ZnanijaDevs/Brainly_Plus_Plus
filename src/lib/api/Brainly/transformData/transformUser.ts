import type { UserDataInModerationTicket } from "@typings/";
import type { UserDataType } from "@typings/Brainly";

import createProfileLink from "@utils/createProfileLink";

export default function transformUser(user: UserDataType): UserDataInModerationTicket {
  return {
    nick: user.nick,
    id: user.id,
    profileLink: createProfileLink(user.id, user.nick),
    gender: user.gender,
    isDeleted: user.is_deleted,
    avatar: user.avatars?.[100],
    ranks: user.ranks?.names || [],
    rankColor: user.ranks?.color,
    isModerator: false // TODO: this
  };
}