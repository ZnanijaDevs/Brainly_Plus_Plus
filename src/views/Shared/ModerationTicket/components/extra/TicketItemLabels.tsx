import { Flex, Label } from "brainly-style-guide";

import { useTicketNode } from "../../hooks";
import LabelWithPoints from "@styleguide/LabelWithPoints";
import AdaptiveButton from "@styleguide/AdaptiveButton";
import ToBackground from "@lib/ToBackground";

export default function TicketItemLabels() {
  const { node } = useTicketNode();

  const checkForPlagiarism = () => {
    let answerContent = node.content;
    let windowSelection = window.getSelection().toString();

    if (windowSelection.length) answerContent = windowSelection;

    ToBackground("CheckForPlagiarism", {
      date: node.created,
      content: answerContent
    });
  };

  return (
    <Flex className="sg-flex--margin-left-auto gap-s" alignItems="center">
      {!!node.points && <LabelWithPoints text={node.points} />}
      {node.isAnswer && <>
        <Label iconType="heart" type="solid" className="thanks-label">{node.thanksCount}</Label>
        <Label hidden={!node.isBest} className="label-with-no-text" title={locales.bestAnswer} iconType="crown" color="yellow"> </Label>
        <AdaptiveButton classList="check-for-plagiarism" onClick={checkForPlagiarism}>
          {locales.plagiarismWithQMark}
        </AdaptiveButton>
      </>}
    </Flex>
  );
}