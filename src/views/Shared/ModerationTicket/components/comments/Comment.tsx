import { useState, useEffect } from "react";
import { Box, Flex, Text, Avatar, BoxPropsType } from "brainly-style-guide";
import clsx from "clsx";

import type { CommonDataInTicketType } from "@typings/";
import _API from "@api/Brainly/Legacy";
import DateTime from "@styleguide/DateTime";
import AdaptiveButton from "@styleguide/AdaptiveButton";

export default function Comment(props: {
  data: CommonDataInTicketType;
  onDelete: (id: number, withWarn: boolean) => void;
  onIgnore: (id: number, ignored: boolean) => void;
}) {
  const comment = props.data;
  const author = comment.author;

  const [reported, setReported] = useState(comment.isReported);
  const [commentIgnored, setCommentIgnored] = useState(false);

  useEffect(() => {
    props.onIgnore(comment.id, commentIgnored);
  }, [commentIgnored]);

  let commentColor: BoxPropsType["color"] = reported ? 
    "red-20" : 
    comment.deleted ? "red-40" : "transparent";

  return (
    <Box 
      border 
      borderColor={reported ? "red-40" : "gray-20"} 
      padding="xs" 
      color={commentColor} 
      className={clsx("moderation-ticket-comment", {
        "comment-with-stripes": commentIgnored && !comment.deleted
      })}
    >
      <div>
        <a href={author.profileLink} title={author.nick} target="_blank">
          <Avatar imgSrc={author.avatar} size="xs" />
        </a>
        <Text size="small" dangerouslySetInnerHTML={{ __html: comment.content }} />
        <Text color="text-gray-70" size="xsmall">
          <DateTime fromNow date={comment.created} />
        </Text>
        <Flex className="gap-s" alignItems="center">
          {reported && 
            <AdaptiveButton 
              type="outline-green" 
              title={locales.accept}
              icon={{ type: "check", size: 16, color: "icon-green-50" }}
              size="s"
              disabled={comment.deleted}
              onClick={async () => {
                await _API.AcceptContent(comment.id, comment.modelTypeId);
                setReported(false);
              }}
            />
          }
          <AdaptiveButton 
            type="solid-peach"
            title={locales.deleteComment}
            icon={{ type: "trash", size: 16, color: "icon-white" }}
            size="s"
            disabled={comment.deleted}
            onClick={e => props.onDelete(comment.id, e.ctrlKey)}
          />
          {!comment.deleted && <AdaptiveButton
            type="solid"
            size="xs"
            icon={{ type: "dot", size: 24, color: "icon-white" }}
            onClick={_ => setCommentIgnored(prevState => !prevState)}
            classList="ignore-comment"
            title={locales.ignoreComment}
          />}
        </Flex>
      </div>
    </Box>
  );
}