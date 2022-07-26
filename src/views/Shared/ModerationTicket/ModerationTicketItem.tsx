import { useState } from "react";
import clsx from "clsx";
import { Box, Flex, Avatar, Text, SeparatorHorizontal } from "brainly-style-guide";

import type { CommonDataInTicketType } from "@typings/";
import { TicketNodeContext, useTicketNode } from "./hooks";

import ReportSection from "./components/report/ReportSection";
import WrongReportSection from "./components/correction/WrongReportSection";
import AuthorSection from "./components/author";
import TicketItemLabels from "./components/extra/TicketItemLabels";
import CommentsSection from "./components/comments/CommentsSection";
import AttachmentsSection from "./components/attachments/AttachmentsSection";
import ItemActionsSection from "./components/extra/ItemActionsSection";

import DateTime from "@styleguide/DateTime";

const TicketItem = () => {
  const { node } = useTicketNode();

  return (
    <Box 
      className={clsx("moderation-ticket-item", {
        "is-approved": node.isApproved,
        "is-reported": node.isReported,
        "sent-for-correction": !!node.correction,
        "is-best": node.isBest && !node.isApproved
      })} 
      border 
      padding="xs" 
      color={node.deleted ? "red-40" : "transparent"}
    >
      {node.isReported && <ReportSection report={node.report} />}
      {!!node.correction && 
        <WrongReportSection edited={node.edited} correction={node.correction} />
      }
      <div>
        <Flex alignItems="center" marginBottom="s">
          <a target="_blank" href={node.author.profileLink}>
            <Avatar size="s" imgSrc={node.author.avatar} />
          </a>
          <Flex direction="column" marginLeft="xs">
            <AuthorSection user={node.author} />
            <Text color="text-gray-70" className="extra-data">
              <DateTime fromNow date={node.created} />
            </Text>
          </Flex>
          <TicketItemLabels />
        </Flex>
        <Flex>
          <Text size="small" dangerouslySetInnerHTML={{ __html: node.content }} />
        </Flex>
        <Flex>
          <AttachmentsSection />
        </Flex>
        <ItemActionsSection />
        {!!node.comments?.length && <>
          <SeparatorHorizontal color="gray-50" />
          <CommentsSection comments={node.comments} />
        </>}
      </div>
    </Box>
  );
};

export default (props: {
  data: CommonDataInTicketType;
}) => {
  const [nodeData, setNodeData] = useState(props.data);

  return <TicketNodeContext.Provider value={{
    node: nodeData,
    updateNode: setNodeData
  }}>
    <TicketItem />
  </TicketNodeContext.Provider>;
};