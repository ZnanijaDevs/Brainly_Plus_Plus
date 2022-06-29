import { Headline, Flex } from "brainly-style-guide";

import type { EntriesByDateDataType } from "@lib/api/Brainly/transformData/transformQuestionLogEntries";
import EntriesSection from "./EntriesSection";

export default function LogSection(props: {
  entries: EntriesByDateDataType;
}) {
  return (
    <Flex marginTop="m" direction="column" className="question-log">
      <Flex alignItems="center" className="gap-s">
        <Headline extraBold size="small">{MESSAGES.questionLog}</Headline>
      </Flex>
      <Flex direction="column" marginTop="xs">
        {Object.keys(props.entries).map((date, i) => 
          <EntriesSection date={date} key={i} entries={props.entries[date]} />
        )}
      </Flex>
    </Flex>
  );
}