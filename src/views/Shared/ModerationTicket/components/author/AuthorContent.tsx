import { useState, useEffect } from "react";
import { 
  Flex, 
  Headline,
  Spinner,
  Link
} from "brainly-style-guide";

import ServerReq, { UserContentDataType } from "@lib/api/Extension";
import Checkbox from "@styleguide/Checkbox";

export default function AuthorUserContent(props: {
  userId: number;
}) {
  const [userContent, setUserContent] = useState<UserContentDataType>(null);

  useEffect(() => {
    ServerReq.GetUserContent(props.userId)
      .then(content => {
        console.debug(content);
        setUserContent(content);
      });
  }, []);

  if (!userContent) return <Spinner size="xsmall" />;

  const userAnswers = userContent.answers;

  return (
    <Flex direction="column" fullHeight={true} fullWidth={true}>
      <a href={`/users/user_content/${props.userId}/responses`} target="_blank">
        <Headline extraBold>{locales.answers} ({userAnswers.count})</Headline>
      </a>
      <Flex direction="column" className="author-user-content-items">
        {userAnswers.items.map(answer =>
          <div key={answer.task_id} className="author-user-content-item">
            <Checkbox />
            <Link 
              size="small" 
              color={answer.is_approved ? "text-green-60" : answer.is_reported ? "text-red-60" : "text-black"}
              weight="bold" 
              target="_blank" 
              href={`/task/${answer.task_id}`}
            >
              {`${answer.has_attachments ? "📎 " : ""}${answer.content}`}
            </Link>
          </div>
        )}
      </Flex>
    </Flex>
  );
}