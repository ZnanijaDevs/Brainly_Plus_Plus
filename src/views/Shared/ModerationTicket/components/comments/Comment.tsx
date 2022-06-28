import { Box, Flex, Text, Avatar } from "brainly-style-guide";
import type { CommonDataInTicketType } from "@typings/";

import DateTime from "../extra/DateTime";
import AdaptiveButton from "../common/AdaptiveButton";

export default function Comment(props: {
  data: CommonDataInTicketType;
  onDelete: (id: number, withWarn: boolean) => void;
}) {
  const comment = props.data;
  const author = comment.author;

  return (
    <Box border borderColor="gray-20" padding="xs" color={
      comment.isReported ? "red-20" : comment.deleted ? "red-40" : "transparent"
    } className="moderation-ticket-comment">
      <div>
        <a href={author.profileLink} title={author.nick} target="_blank">
          <Avatar imgSrc={author.avatar} size="xs" />
        </a>
        <Text size="small">
          {comment.content}
        </Text>
        <Text color="text-gray-70" size="xsmall">
          <DateTime fromNow date={comment.created} />
        </Text>
        <Flex className="gap-s">
          {comment.isReported && 
            <AdaptiveButton 
              type="outline-green" 
              title="Принять комментарий"
              icon={{ type: "check", size: 16, color: "icon-green-50" }}
              size="s"
              disabled={comment.deleted}
            />
          }
          <AdaptiveButton 
            type="solid-peach"
            title="Удалить комментарий. Удерживайте Ctrl, чтобы удалить с предупреждением"
            icon={{ type: "trash", size: 16, color: "icon-white" }}
            size="s"
            disabled={comment.deleted}
            onClick={e => props.onDelete(comment.id, e.ctrlKey)}
          />
        </Flex>
      </div>
    </Box>
  );
}