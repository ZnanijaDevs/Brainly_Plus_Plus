import type { Root } from "react-dom/client";
import {
  TopLayer,
  ContentBox,
  ContentBoxHeader,
  ContentBoxContent,
  Headline,
  Link,
  Flex,
  SeparatorHorizontal,
  Breadcrumb,
  Text,
  SubjectIconBox,
  SubjectIconType,
  Label
} from "brainly-style-guide";

import type { ModerationTicketContextDataType } from "@typings/";
import _API from "@lib/api/Brainly/Legacy";

import TicketTimer from "./components/extra/TicketTimer";
import ModerationTicketItem from "./ModerationTicketItem";
import QuestionLogSection from "./components/log";
import AdaptiveButton from "./components/common/AdaptiveButton";

export default function Ticket(props: {
  questionId: number;
  context: ModerationTicketContextDataType;
  expiryTime: Date;
  root: Root;
}) {
  const { context, expiryTime, questionId } = props;

  const closeTicket = (expire = true) => {
    if (expire) _API.ExpireTicket(questionId);

    props.root.unmount();
    document.getElementById("moderation-ticket-popup").remove();
  };

  return (
    <div id="moderation-ticket-back" onClick={() => closeTicket()}>
      <TopLayer splashScreen size="medium" onClick={e => e.stopPropagation()}>
        <ContentBox>
          <ContentBoxHeader spacedBottom="large" className="moderation-ticket-header">
            <Headline>{MESSAGES.moderation}</Headline>
            <Link href={context.taskLink} size="medium" target="_blank" className="question-link">
              #{questionId}
            </Link>
            <TicketTimer 
              expiryTimestamp={expiryTime} 
              onExpire={() => closeTicket(false)} 
              taskId={questionId}
              ticketId={context.ticketData.id}
            />
            <AdaptiveButton 
              size="m"
              type="transparent"
              icon={{ color: "icon-black", type: "close", size: 24 }}
              onClick={() => closeTicket()}
            />
            <div className="moderation-ticket-flashes-container" />
          </ContentBoxHeader>
          <ContentBoxContent spacedBottom="large">
            <Flex marginBottom="xs" justifyContent="space-between" alignItems="center">
              <Flex>
                <SubjectIconBox type={context.subject.icon as SubjectIconType} size="small" />
                <Text size="small">
                  <Breadcrumb elements={[
                    context.subject.name,
                    context.grade,
                    `ответов: ${context.answers.length}`
                  ]} />
                </Text>
              </Flex>
              {context.answers.some(answer => answer.isApproved) && 
                <Label iconType="verified" color="green">{MESSAGES.approvedAnswers.toLowerCase()}</Label>
              }
            </Flex>
            <ModerationTicketItem data={context.task} />
            {!!context.answers.length && <>
              <SeparatorHorizontal color="gray-50" />
              <Headline extraBold>{MESSAGES.answers} ({context.answers.length})</Headline>
              {context.answers.map(answer => <ModerationTicketItem data={answer} key={answer.id} />)}
            </>}
            <QuestionLogSection entries={context.logEntries} />
          </ContentBoxContent>
        </ContentBox>
      </TopLayer>
    </div>
  );
}