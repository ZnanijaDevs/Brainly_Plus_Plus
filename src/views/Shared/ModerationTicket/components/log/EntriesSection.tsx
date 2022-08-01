import { useState } from "react";
import { Flex, Text } from "brainly-style-guide";

import type { QuestionLogEntry } from "@typings/Brainly";

import { AdaptiveButton, DateTime } from "@components";
import LogEntry from "./LogEntry";

export default function EntriesSection(props: {
  date: string;
  entries: QuestionLogEntry[];
}) {
  const [visible, setVisible] = useState(true);

  let entriesCount = props.entries.length.toString();
  let entriesCountText = locales.actionsInQuestionLog.plural;

  if (/(?<!1)(2|4|3)$/.test(entriesCount)) {
    entriesCountText = locales.actionsInQuestionLog.plural2;
  } else if (/(?<=0|^)1$/.test(entriesCount)) {
    entriesCountText = locales.actionsInQuestionLog.singular;
  }

  return (
    <Flex direction="column" fullWidth marginBottom="xs">
      <Flex alignItems="center">
        <Text weight="bold" size="small">
          <DateTime fromNow={false} date={props.date} />
          <span className="question-log-section-actions-count"> - {entriesCount} {entriesCountText}</span>
        </Text>
        <AdaptiveButton type="solid-light" icon={{
          type: visible ? "arrow_up" : "arrow_down"
        }} onClick={() => setVisible(prevState => !prevState)} />
      </Flex>
      <Flex direction="column" hidden={!visible}>
        {props.entries.map((logEntry, i) => <LogEntry key={i} entry={logEntry} />)}
      </Flex>
    </Flex>
  );
}