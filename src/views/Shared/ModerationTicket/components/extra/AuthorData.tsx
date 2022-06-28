import {
  Flex,
  Breadcrumb,
  Link,
  Text
} from "brainly-style-guide";
import type { UserDataInModerationTicket } from "@typings/";

export default function AuthorData(props: {
  user: UserDataInModerationTicket
}) {
  const user = props.user;

  return (
    <Flex direction="column">
      <Breadcrumb className={user.isModerator ? "user-is-moderator brn-placeholder__animation" : ""} 
        elements={[
          <Link color="text-black" size="small" weight="bold" target="_blank" href={user.profileLink}>
            {user.nick}
          </Link>,
          <Text size="small" style={{
            color: user.rankColor
          }}>{user.ranks.join(", ")}</Text>
        ]} 
      />
    </Flex>
  );
}