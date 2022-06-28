import { useState } from "react";
import { Flex, Button, Headline, Icon } from "brainly-style-guide";

import type { CommonDataInTicketType } from "@typings/";
import _API from "@lib/api/Brainly/Legacy";

import Comment from "./Comment";
import AdaptiveButton from "../common/AdaptiveButton";
import Flash from "@utils/Flashes";

export default function CommentsSection(props: {
  comments: CommonDataInTicketType[];
}) {
  const [hidden, setHidden] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [comments, setComments] = useState(props.comments);

  const deleteComment = async (commentId: number, withWarn: boolean) => {
    try {
      await _API.DeleteComment({ id: commentId, warn: withWarn });

      setComments(prevComments => 
        prevComments.map(comment => {
          if (comment.id === commentId) comment.deleted = true;
          return comment;
        })
      );
    } catch (err) {
      Flash("error", err);
    }
  };

  const deleteAllComments = () => {
    if (!confirm(MESSAGES.doYouWantToDeleteAllComments)) return;

    setIsDeleting(true);
  
    notDeletedComments.forEach((comment, thisCommentIndex) => {
      deleteComment(comment.id, false);

      let lastCommentIndex = notDeletedComments.length - 1;
      if (thisCommentIndex === lastCommentIndex) setIsDeleting(false);
    });
  };

  const notDeletedComments = comments.filter(comment => !comment.deleted);

  return (
    <Flex direction="column" justifyContent="space-between" marginTop="s">
      <Flex justifyContent="space-between">
        <Flex className="gap-s" alignItems="center">
          <Headline color="text-indigo-60" extraBold size="small">
            Комментарии [{notDeletedComments.length}]
          </Headline>
          <Button
            type="solid-indigo-inverted"
            size="s" 
            onClick={_ => setHidden(prevState => !prevState)} 
            iconOnly 
            icon={<Icon size={16} color="icon-black" type={hidden ? "arrow_down" : "arrow_up"} />} 
          />
        </Flex>
        <AdaptiveButton disabled={isDeleting || !notDeletedComments.length} type="solid-peach" onClick={deleteAllComments}>
          Удалить все комментарии
        </AdaptiveButton>
      </Flex>
      <Flex className="moderation-ticket-comments-list" disabled={isDeleting} hidden={hidden} marginTop="xs" direction="column">
        {comments.map(comment => 
          <Comment onDelete={deleteComment} data={comment} key={comment.id} />
        )}
      </Flex>
    </Flex>
  );
}