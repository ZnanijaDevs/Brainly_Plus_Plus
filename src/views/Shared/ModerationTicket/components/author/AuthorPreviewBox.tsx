import { useState } from "react";
import { 
  Flex, 
  Avatar, 
  Text, 
  Link, 
  Breadcrumb, 
  Bubble
} from "brainly-style-guide";

import type { UserDataInProfileType } from "@lib/api/Brainly/GetUserProfile";
import createProfileLink from "@utils/createProfileLink";

import WarnsSection from "../warns/WarnsSection";
import AuthorUserContent from "./AuthorContent";

export default function AuthorPreviewBox(props: {
  user: UserDataInProfileType;
}) {
  const user = props.user;

  const [activeBan, setActiveBan] = useState(user.activeBan);

  return (
    <Bubble direction="left" className="author-preview-box">
      <div>
        <Flex direction="column" alignItems="center">
          <Flex alignItems="center" marginBottom="xs" className={activeBan ? "author-is-banned" : ""}>
            <Avatar imgSrc={user.avatar} size="xs" />
            <Flex marginLeft="xs" direction="column">
              <Breadcrumb elements={[
                <Link size="small" target="_blank" href={createProfileLink(user.id)}>
                  {user.nick}
                </Link>,
                <Text size="xsmall">{user.ranks[0]}</Text>
              ]} />
              {!!activeBan && 
                <Text size="xsmall" className="ban-label">
                  Бан {activeBan.type}. Выдан <b>{activeBan.givenBy.nick}</b>
                </Text>
              }
            </Flex>
          </Flex>
          <WarnsSection userId={user.id} />
        </Flex>
        <Flex alignItems="center" className="author-user-content">
          {<AuthorUserContent userId={user.id} />}
        </Flex>
      </div>
    </Bubble>
  );
}