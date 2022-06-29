import { Box, Icon, Flex, Text, Link } from "brainly-style-guide";
import type { AnswerCorrectionDataType } from "@typings/";

import DateTime from "../common/DateTime";

export default function AnswerCorrectionSection(props: {
  correction: AnswerCorrectionDataType;
  edited: boolean;
}) {
  const { moderator, date, reason } = props.correction;

  return (
    <Box color="white" border borderColor="blue-40" padding="xs" className="moderation-ticket-wrong-report">
      <Flex alignItems="center">
        <Icon type="pencil" color={props.edited ? "icon-green-50" : "icon-indigo-50"} size={32} />
        <Flex direction="column">
          <Text size="small" weight="bold">
            {props.edited ? MESSAGES.answerWasCorrected : MESSAGES.sentForCorrection}
            <Link target="_blank" size="small" href={moderator.profileLink}>{moderator.nick}</Link>
          </Text>
          <Text size="small">{reason}</Text>
        </Flex>
        <Text size="xsmall" color="text-gray-70">
          <DateTime date={date} fromNow />
        </Text>
      </Flex>
    </Box>
  );
}