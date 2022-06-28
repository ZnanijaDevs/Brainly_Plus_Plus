import { useState } from "react";
import { Flex, Text } from "brainly-style-guide";

import type { QuestionLogEntry } from "@typings/Brainly";

import AdaptiveButton from "../common/AdaptiveButton";
import DateTime from "../extra/DateTime";
import LogEntry from "./LogEntry";

export default function EntriesSection(props: {
  date: string;
  entries: QuestionLogEntry[];
}) {
  const [visible, setVisible] = useState(true);

  return (
    <Flex direction="column" fullWidth marginBottom="xs">
      <Flex alignItems="center">
        <Text weight="bold" size="small">
          <DateTime fromNow={false} date={props.date} />
          <span className="question-log-section-actions-count"> - {props.entries.length} действий</span>
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