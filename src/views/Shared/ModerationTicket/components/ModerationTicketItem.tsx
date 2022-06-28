import { 
  Box,
  Text,
  Flex,
  Avatar,
  Label,
  SeparatorHorizontal
} from "brainly-style-guide";

import type { CommonDataInTicketType } from "@typings/";
import _API from "@lib/api/Brainly/Legacy";
import replaceTextWithLinks from "@utils/replaceTextWithLinks";

import AuthorData from "./extra/AuthorData";
import AttachmentsSection from "./attachments/AttachmentsSection";
import DateTime from "./extra/DateTime";
import LabelWithPoints from "./extra/LabelWithPoints";
import CommentsSection from "./comments/CommentsSection";
import AdaptiveButton from "./common/AdaptiveButton";
import Flash from "@utils/Flashes";

export default function ModerationTicketNode({ data }: { 
  data: CommonDataInTicketType
}) {
  let nodeClassNames = ["moderation-ticket-item"];

  if (data.isApproved) nodeClassNames.push("is-approved");
  if (data.isReported) nodeClassNames.push("is-reported");
  
  return (
    <Box className={nodeClassNames.join(" ")} border shadow={false}>
      <Flex alignItems="center" marginBottom="s">
        <a target="_blank" href={data.author.profileLink}>
          <Avatar size="s" imgSrc={data.author.avatar} />
        </a>
        <Flex direction="column" marginLeft="xs">
          <AuthorData user={data.author} />
          <Text color="text-gray-70" className="extra-data">
            <DateTime fromNow date={data.created} />
          </Text>
        </Flex>
        <Flex className="sg-flex--margin-left-auto gap-s">
          {data.thanksCount && 
            <Label iconType="heart" color="red" type="solid">{data.thanksCount}</Label>}
          {data.points && <LabelWithPoints text={data.points} />}
          {data.isBest && 
            <Label className="label-with-no-text" title="Лучший ответ" iconType="crown" color="yellow" type="solid"> </Label>}
        </Flex>
      </Flex>
      <Flex>
        <Text size="small" dangerouslySetInnerHTML={{ 
          __html: replaceTextWithLinks(data.content)
        }} />
      </Flex>
      <Flex>
        <AttachmentsSection 
          attachments={data.attachments} 
          modelId={data.id}
          modelTypeId={data.modelTypeId}
          taskId={data.taskId}
        />
      </Flex>
      <Flex className="gap-s" marginTop="xs" alignItems="center">
        {data.isApproved ? 
          <AdaptiveButton icon={{ type: "verified", color: "icon-white" }} onClick={e => {
            _API.UnapproveAnswer(data.id)
              .catch(err => {
                Flash("error", err);
              });
          }}>
            Снять проверку
          </AdaptiveButton> : <>
            <AdaptiveButton 
              size="m" 
              type="solid-peach" 
              icon={{ type: "trash", color: "icon-white", size: 24 }}
              title="Удалить" 
            />
            {data.isReported && 
              <AdaptiveButton
                title="Принять"
                size="m"
                type="outline-green"
                icon={{ type: "check", color: "icon-green-50", size: 24 }}
              />
            }
            {data.modelType === "answer" && <>
              <AdaptiveButton 
                title="Удалить как спам (с предупреждением)"
                size="m" 
                type="solid-orange"
                icon={{ type: "close", color: "icon-white", size: 24 }} 
              />
              <AdaptiveButton 
                title="Отправить на исправление"
                size="m" 
                type="facebook"
                icon={{ type: "pencil", color: "icon-white", size: 24 }} 
              />
              {!data.isApproved && 
                <AdaptiveButton 
                  size="m" 
                  icon={{ type: "verified", color: "icon-white", size: 24 }}
                  title="Принять в архив"
                />
              }
            </>}
          </>
        }
      </Flex>
      {!!data.comments?.length && <>
        <SeparatorHorizontal color="gray-50" />
        <CommentsSection comments={data.comments} />
      </>}
    </Box>
  );
}