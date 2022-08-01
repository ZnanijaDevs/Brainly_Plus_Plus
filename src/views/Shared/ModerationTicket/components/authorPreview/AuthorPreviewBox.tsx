import { useState, useEffect } from "react";
import clsx from "clsx";
import { Flex, Avatar, Link, Breadcrumb, Bubble, Text } from "brainly-style-guide";

import type { UserDataInProfileType } from "@api/Brainly/GetUserProfile";
import createProfileLink from "@utils/createProfileLink";

import WarnsSection from "../warns/WarnsSection";
import AuthorUserContent from "./AuthorContent";
import BanSection from "./BanSection";

export default function AuthorPreviewBox(props: {
  user: UserDataInProfileType;
}) {
  const user = props.user;

  const [activeBan, setActiveBan] = useState(user.activeBan);
  const [bansCount, setBansCount] = useState(user.bansCount);

  useEffect(() => setBansCount(prevState => ++prevState), [activeBan]);

  return (
    <Bubble direction="left" className="author-preview-box">
      <div>
        <Flex direction="column" alignItems="center">
          <Flex alignItems="center" marginBottom="xs" className={clsx(activeBan && "author-is-banned")}>
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
                  {locales.ban} {activeBan.type}. {locales.given} <b>{activeBan.givenBy.nick}</b>
                </Text>
              }
            </Flex>
          </Flex>
          <Text className="user-ban-count" color="text-gray-70" weight="bold" size="xsmall">
            {locales.bans}: {bansCount}
          </Text>
          <WarnsSection userId={user.id} />
          {user.canBeBanned && 
            <BanSection 
              user={user}
              onBanned={banType => setActiveBan({
                givenBy: { 
                  link: System.userLink, 
                  nick: System.me.user.nick 
                },
                expiresIn: null,
                type: banType
              })}
            />
          }
        </Flex>
        <Flex alignItems="center" justifyContent="center" className="author-user-content">
          {<AuthorUserContent userId={user.id} />}
        </Flex>
      </div>
    </Bubble>
  );
}