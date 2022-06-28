import { useState } from "react";
import { Flex, Text, Icon, IconPropsType, IconType } from "brainly-style-guide";

import type { QuestionLogEntry, QuestionLogEntryClassType } from "@typings/Brainly";
import replaceTextWithLinks from "@utils/replaceTextWithLinks";
import AdaptiveButton from "../common/AdaptiveButton";

const ENTRY_ICONS: Record<
  QuestionLogEntryClassType, { color: IconPropsType["color"], type: IconType; }
> = {
  "accepted": { color: "icon-green-50", type: "check" },
  "deleted": { color: "icon-red-50", type: "trash" },
  "best": { color: "icon-yellow-50", type: "crown" },
  "added": { color: "icon-green-50", type: "plus" },
  "edited": { color: "icon-blue-50", type: "pencil" },
  "info": { color: "icon-blue-50", type: "info" },
  "reported": { color: "icon-red-50", type: "report_flag" }
};

export default function LogEntry(props: {
  entry: QuestionLogEntry
}) {
  const entry = props.entry;
  const entryIcon = ENTRY_ICONS[entry.class];

  const [detailsVisible, setDetailsVisible] = useState(false);

  return (
    <Flex direction="column" className="question-log-entry">
      <div className="question-log-entry-header">
        <Flex marginRight="xxs">
          <Icon size={16} color={entryIcon.color} type={entryIcon.type} />
        </Flex>
        <Text size="small" type="div" dangerouslySetInnerHTML={{
          __html: entry.text
        }} />
        <Text className="question-log-entry-time" weight="bold" color="text-gray-50">
          {entry.time}
        </Text>
        <AdaptiveButton
          type="transparent"
          icon={{
            type: detailsVisible ? "arrow_up" : "more"
          }}
          visible={!!entry.descriptions}
          onClick={() => setDetailsVisible(prevState => !prevState)}
        />
      </div>
      <Flex hidden={!detailsVisible} direction="column" marginTop="xs" marginBottom="s">
        {entry.descriptions?.map((description, i) =>
          <Flex direction="column" key={i}>
            <Text size="small" weight="bold">{description.subject}</Text>
            <Text breakWords size="small" dangerouslySetInnerHTML={{
              __html: replaceTextWithLinks(description.text)
            }} />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}