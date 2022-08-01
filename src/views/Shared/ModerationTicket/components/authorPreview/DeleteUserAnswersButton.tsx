import type { UserAnswerData } from "@typings/ServerReq";
import _API from "@api/Brainly/Legacy";
import { AdaptiveButton } from "@components";

export default function DeleteUserAnswersButton(props: {
  selectedAnswers: UserAnswerData[];
  onDelete: (answerId: number) => void;
}) {
  const deleteAnswers = async () => {
    let answers = props.selectedAnswers;

    for await (let answer of answers) {
      await _API.DeleteAnswer({
        id: answer.id,
        giveWarn: true,
        reason: locales.spamAnswerDeletionReason
      });

      props.onDelete(answer.id);
    }
  };

  return (
    <AdaptiveButton 
      type="solid-peach"
      showConfirmMessageOnClick={true}
      onClick={deleteAnswers}
    >{locales.deleteAsSpam}</AdaptiveButton>
  );
}