import React, { useState } from "react";
import moment from "moment";
import { Flex, Textarea } from "brainly-style-guide";

import _API from "@lib/api/Brainly/Legacy";
import createProfileLink from "@utils/createProfileLink";
import flash from "@utils/flashes";

import AdaptiveButton from "@styleguide/AdaptiveButton";
import { useTicketNode } from "../../hooks";

export default function CorrectItemSection() {
  const { node, updateNode } = useTicketNode();
  const [reason, setReason] = useState("");

  const sendForCorrection = async () => {
    await _API.AskForCorrection(node.id, reason);

    let author = node.author;

    _API.SendMessage(
      node.author.id, 
      locales.messages.pleaseCorrectYourAnswer
        .replace("%nick%", author.nick)
        .replace("%questionId%", node.taskId?.toString())
        .replace("%reason%", reason)
    );

    const moderator = System.me.user;

    flash("default", locales.answerHasBeenSentForCorrection);

    updateNode({
      correction: {
        reason,
        date: moment().toISOString(),
        moderator: {
          id: moderator.id,
          nick: moderator.nick,
          gender: moderator.gender,
          isDeleted: false,
          isModerator: true,
          profileLink: createProfileLink(moderator.id),
          ranks: System.viewer.ranks,
          rankColor: moderator.ranks?.color,
          avatar: System.userAvatar
        }
      }
    });
  };

  return (
    <Flex direction="column" marginTop="xs">
      <Textarea 
        fullWidth 
        placeholder={locales.additionalDataForUser}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setReason(e.currentTarget.value)
        }
      />
      <AdaptiveButton 
        type="facebook" 
        classList="ok-button"
        onClick={sendForCorrection}
      >
        {locales.send}
      </AdaptiveButton>
    </Flex>
  ); 
}