import { useState, useEffect } from "react";
import { 
  Flex, 
  Headline,
  Link
} from "brainly-style-guide";

import type { UserAnswerData } from "@typings/ServerReq";
import ServerReq, { UserAnswersDataType } from "@lib/api/Extension";

import Checkbox from "@styleguide/Checkbox";
import Loader from "@styleguide/Loader";
import DeleteUserAnswersButton from "./DeleteUserAnswersButton";
import OpenAnswersButton from "./OpenAnswersButton";

export default function AuthorUserContent(props: {
  userId: number;
}) {
  const [answers, setAnswers] = useState<UserAnswersDataType>();
  const [error, setError] = useState<string>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<UserAnswerData[]>([]);

  useEffect(() => {
    ServerReq.GetUserAnswers(props.userId)
      .then(content => setAnswers(content))
      .catch(err => setError(err.message));
  }, []);

  useEffect(() => {
    let newSelectedAnswers = [];

    for (let selectedAnswer of selectedAnswers) {
      if (!answers.answers.find(answer => selectedAnswer.id === answer.id)) continue;

      newSelectedAnswers.push(selectedAnswer);
    }

    setSelectedAnswers(newSelectedAnswers);
  }, [answers]);

  if (error) {
    return <Headline color="text-red-60" extraBold size="small" type="h3">{error}</Headline>;
  } else if (!answers) {
    return <Loader />;
  }
  
  return (
    <Flex direction="column" fullHeight={true} fullWidth={true}>
      <a href={`/users/user_content/${props.userId}/responses`} target="_blank">
        <Headline extraBold>{locales.answers} ({answers.count})</Headline>
      </a>
      <Flex direction="column" className="author-user-content-items">
        {answers.answers.map(answer =>
          <div key={answer.question.id} className="author-user-content-item">
            <Checkbox 
              onChange={checked => {
                setSelectedAnswers(prevState => (
                  checked ? [...prevState, answer] : prevState.filter(x => x.id !== answer.id)
                ));
              }}
            />
            <Link 
              size="small" 
              color={
                answer.isApproved ? "text-green-60" : answer.isReported ? "text-red-60" : "text-black"
              }
              target="_blank" 
              href={answer.question.link}
            >{answer.content}</Link>
          </div>
        )}
      </Flex>
      <Flex className="gap-s">
        {System.checkP(11) && <DeleteUserAnswersButton 
          selectedAnswers={selectedAnswers} 
          onDelete={answerId => {
            setAnswers(prevState => 
              ({ 
                ...prevState, 
                answers: prevState.answers.filter(x => x.id !== answerId),
                count: --prevState.count 
              })
            );
          }}
        />}
        <OpenAnswersButton selectedAnswers={selectedAnswers} />
      </Flex>
    </Flex>
  );
}