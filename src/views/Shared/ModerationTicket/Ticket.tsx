import {
  TopLayer,
  ContentBox,
  ContentBoxHeader,
  ContentBoxContent,
  Headline,
  Link,
  Icon,
  Flex,
  Button,
  SeparatorHorizontal,
  Breadcrumb,
  Text
} from "brainly-style-guide";

import type { ModerationTicketContextDataType } from "@typings/";

import TicketTimer from "./components/TicketTimer";
import ModerationTicketItem from "./components/ModerationTicketItem";
import QuestionLogSection from "./components/log";

export default function Ticket(props: {
  questionId: number;
  context: ModerationTicketContextDataType;
  expiryTime: Date;
}) {
  const { context, expiryTime, questionId } = props;

  return (
    <div id="moderation-ticket-back">
      <TopLayer splashScreen size="medium">
        <ContentBox>
          <ContentBoxHeader spacedBottom="large" className="moderation-ticket-header">
            <Headline>Модерация вопроса</Headline>
            <TicketTimer expiryTimestamp={expiryTime} />
            <Button className="close-ticket" type="transparent" iconOnly icon={<Icon color="icon-black" type="close" />} />
            <div className="moderation-ticket-flashes-container" />
          </ContentBoxHeader>
          <ContentBoxContent spacedBottom="large">
            <Flex marginBottom="xs">
              <Text size="small">
                <Breadcrumb elements={[
                  <Link href={context.taskLink} size="medium" target="_blank" className="question-link">#{questionId}</Link>,
                  context.subject.name,
                  context.grade,
                  `ответов: ${context.answers.length}`
                ]} />
              </Text>
            </Flex>
            <ModerationTicketItem data={context.task} />
            <SeparatorHorizontal color="gray-50" />
            <Headline extraBold>Ответы ({context.answers.length})</Headline>
            {context.answers.map(answer => <ModerationTicketItem data={answer} key={answer.id} />)}
            <QuestionLogSection entries={context.logEntries} />
          </ContentBoxContent>
        </ContentBox>
      </TopLayer>
    </div>
  );
}