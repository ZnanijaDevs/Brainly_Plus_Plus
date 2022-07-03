import { useState, useEffect } from "react";
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
import getUserPrivileges, { UserPrivilegesDataType } from "@utils/getUserPrivileges";
import Flash from "@utils/flashes";
import ToBackground from "@lib/ToBackground";

import AttachmentsSection from "./components/attachments/AttachmentsSection";
import DateTime from "./components/common/DateTime";
import LabelWithPoints from "./components/extra/LabelWithPoints";
import CommentsSection from "./components/comments/CommentsSection";
import AdaptiveButton from "./components/common/AdaptiveButton";
import ReportSection from "./components/report";
import AnswerCorrectionSection from "./components/correction";
import AuthorSection from "./components/author";

// TODO: refactor this component

export default function ModerationTicketNode({ data }: { 
  data: CommonDataInTicketType;
}) {
  const [reported, setReported] = useState(data.isReported);
  const [approved, setApproved] = useState(data.isApproved);
  const [deleted, setDeleted] = useState(false);
  const [sentForCorrection, setSentForCorrection] = useState(!!data.correction);

  const [userPrivileges, setUserPrivileges] = useState<UserPrivilegesDataType>();

  useEffect(() => {
    getUserPrivileges()
      .then(privileges => setUserPrivileges(privileges))
      .catch(err => Flash("error", err));
  }, []);

  let itemClassName = "moderation-ticket-item";

  if (approved) 
    itemClassName += " is-approved";
  else if (reported) 
    itemClassName += " is-reported";
  else if (sentForCorrection)
    itemClassName += " sent-for-correction";
  else if (data.isBest)
    itemClassName += " is-best";
  
  return !userPrivileges ? null : (
    <Box className={itemClassName} border padding="xs" color={deleted ? "red-40" : "transparent"}>
      {reported && <ReportSection report={data.report} />}
      {sentForCorrection && 
        <AnswerCorrectionSection edited={data.edited} correction={data.correction} />
      }
      <div>
        <Flex alignItems="center" marginBottom="s">
          <a target="_blank" href={data.author.profileLink}>
            <Avatar size="s" imgSrc={data.author.avatar} />
          </a>
          <Flex direction="column" marginLeft="xs">
            <AuthorSection user={data.author} />
            <Text color="text-gray-70" className="extra-data">
              <DateTime fromNow date={data.created} />
            </Text>
          </Flex>
          <Flex className="sg-flex--margin-left-auto gap-s" alignItems="center">
            {!!data.points && <LabelWithPoints text={data.points} />}
            {data.modelType === "answer" && <>
              <Label iconType="heart" color="red" type="solid">{data.thanksCount}</Label>
              <Label hidden={!data.isBest} className="label-with-no-text" title={MESSAGES.bestAnswer} iconType="crown" color="yellow" type="solid"> </Label>
              <AdaptiveButton classList="check-for-plagiarism" onClick={_ => {
                let answerContent = data.content;
                let windowSelection = window.getSelection().toString();

                if (windowSelection.length) answerContent = windowSelection;

                ToBackground("CheckForPlagiarism", {
                  date: data.created,
                  content: answerContent
                });
              }}>
                Плагиат?
              </AdaptiveButton>
            </>}
          </Flex>
        </Flex>
        <Flex>
          <Text size="small" dangerouslySetInnerHTML={{ __html: data.content }} />
        </Flex>
        <Flex>
          <AttachmentsSection 
            attachments={data.attachments} 
            modelId={data.id}
            modelTypeId={data.modelTypeId}
            taskId={data.taskId}
          />
        </Flex>
        {!deleted && <Flex className="gap-s" marginTop="s" alignItems="center">
          {approved ? (
            userPrivileges.canUnapprove && 
              <AdaptiveButton icon={{ type: "verified", color: "icon-white" }} onClick={async _ => {
                await _API.UnapproveAnswer(data.id);
                setApproved(false);
              }}>Снять проверку</AdaptiveButton>
          ) : <>
            <AdaptiveButton 
              size="m" 
              type="outline-peach"
              icon={{ type: "trash", size: 24 }}
              title={MESSAGES.delete}
            />
            {((reported || sentForCorrection) && userPrivileges.canAccept) && 
              <AdaptiveButton
                title={MESSAGES.accept}
                size="m"
                type="solid-green"
                icon={{ type: "check", size: 24 }}
                onClick={async () => {
                  await _API.AcceptContent(data.id, data.modelTypeId);
                  setReported(false);
                  if (sentForCorrection) setSentForCorrection(false);
                }}
              />
            }
            {data.modelType === "answer" && <>
              {!data.author.isModerator && <AdaptiveButton 
                title={MESSAGES.deleteAsSpamWithWarn}
                size="m" 
                type="solid-orange"
                icon={{ type: "close", size: 24 }} 
                onClick={async _ => {
                  if (!confirm(MESSAGES.doYouWantToDeleteThisAnswerAsSpam)) return;

                  await _API.DeleteAnswer({
                    id: data.id,
                    giveWarn: true,
                    reason: MESSAGES.spamAnswerDeletionReason,
                  });

                  setDeleted(true);
                }}
              />}
              {!sentForCorrection && <AdaptiveButton 
                title={MESSAGES.sendForCorrection}
                size="m" 
                type="outline-indigo"
                icon={{ type: "pencil", color: "icon-indigo-50", size: 24 }} 
              />}
              {(!approved && userPrivileges.canApprove) && 
                <AdaptiveButton 
                  size="m" 
                  icon={{ type: "verified", color: "icon-white", size: 24 }}
                  title={MESSAGES.approve}
                  onClick={async _ => {
                    await _API.ApproveAnswer(data.id);
                    setApproved(true);
                    if (sentForCorrection) setSentForCorrection(false);
                  }}
                  type="solid-green"
                />
              }
            </>}
          </>}
        </Flex>}
        {!!data.comments?.length && <>
          <SeparatorHorizontal color="gray-50" />
          <CommentsSection comments={data.comments} />
        </>}
      </div>
    </Box>
  );
}