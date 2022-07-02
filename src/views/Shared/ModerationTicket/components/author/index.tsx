import { useEffect, useState } from "react";
import { Flex, Text, Breadcrumb, Link } from "brainly-style-guide";

import GetUserProfile, { UserDataInProfileType } from "@lib/api/Brainly/GetUserProfile";
import type { UserDataInModerationTicket } from "@typings/";
import AdaptiveButton from "../common/AdaptiveButton";

export default function AuthorSection({ user }: {
  user: UserDataInModerationTicket;
}) {
  const [extraData, setExtraData] = useState<UserDataInProfileType>(null);

  useEffect(() => {
    GetUserProfile(user.id)
      .then(user => setExtraData(user));
  }, []);

  return (
    <Flex>
      <Flex direction="column">
        <Breadcrumb className={user.isModerator ? "user-is-moderator brn-placeholder__animation" : ""} 
          elements={[
            <Link color="text-black" size="small" weight="bold" target="_blank" href={user.profileLink}>
              {user.nick}
            </Link>,
            <Text size="small" style={{ color: user.rankColor }}>{user.ranks.join(", ")}</Text>
          ]} 
        />
        {extraData && <Text size="xsmall" className="user-extra-data">
          <Breadcrumb elements={[
            <Text type="span" weight="bold" inherited color={extraData.isOnline ? "text-green-60" : "text-red-60"}>
              {extraData.onlineStatus}
            </Text>,
            <Text inherited color="text-black">
              {MESSAGES.warnsV1}:
              <Link inherited href={`/users/view_user_warns/${user.id}`} target="_blank">
                {extraData.warnsCount}
              </Link>
            </Text>
          ]} />
        </Text>}
      </Flex>
      <AdaptiveButton
        size="xs"
        icon={{ type: "profile_view", color: "icon-white" }}
        type="facebook"
        title={MESSAGES.viewUserProfile}
        classList="open-user-preview"
        disabled={!extraData}
      />
    </Flex>
  );
}