import type { UserAnswerData } from "@typings/ServerReq";
import AdaptiveButton from "@styleguide/AdaptiveButton";

export default function OpenAnswersButton(props: {
  selectedAnswers: UserAnswerData[];
}) {
  return <AdaptiveButton 
    icon={{ type: "open_in_new_tab" }}
    type="outline"
    onClick={_ => {
      props.selectedAnswers.forEach(answer => window.open(answer.question.link));
    }}
  />;
}