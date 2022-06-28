import { createRoot } from "react-dom/client";

import _API from "@lib/api/Brainly/Legacy";
import Flash from "@utils/Flashes";

import type { ModerationTicketContextDataType } from "@typings/";
import { transformNodeInModerationTicket } from "@lib/api/Brainly/transformData";
import transformQuestionLogEntries from "@lib/api/Brainly/transformData/transformQuestionLogEntries";

import Ticket from "./Ticket";
import { gradeById, subjectById } from "@utils/getMarketConfig";

const ticketRoot = createRoot(document.getElementById("moderation-ticket-react-app"));

export default async function OpenTicket(
  questionId: number,
  options: {
    showFlashOnError?: boolean;
  } = { showFlashOnError: true }
) {
  try {
    const [
      data,
      questionLog
    ] = await Promise.all([
      _API.OpenTicket(questionId),
      _API.GetQuestionLog(questionId)
    ]);
    // const question = await ServerReq.GetQuestionContent(questionId);
  
    // setTimeout(() => _API.ExpireTicket(questionId), 5000);

    const {
      ticket,
      task,
      responses
    } = data.data;
    const usersData = data.users_data;

    const time = new Date();
    time.setSeconds(time.getSeconds() + ticket.time_left);

    const context: ModerationTicketContextDataType = {
      ticketData: {
        id: ticket.id,
        timeLeft: ticket.time_left
      },
      taskLink: `/task/${task.id}`,
      task: {
        ...transformNodeInModerationTicket(task, usersData),
      },
      answers: responses.map(
        response => ({
          ...transformNodeInModerationTicket(response, usersData),
          thanksCount: response.thanks,
          isBest: response.best,
          isApproved: questionLog.data.some(entry => 
            entry.owner_id === response.user_id &&
            /был принят/.test(entry.text) &&
            entry.type === 92
          )
        })
      ),
      logEntries: transformQuestionLogEntries(questionLog.data, questionLog.users_data),
      grade: gradeById(task.grade_id),
      subject: subjectById(task.subject_id)
    };

    console.debug(`Moderation ticket context for #${questionId}`, context);

    ticketRoot.render(
      <Ticket questionId={questionId} context={context} expiryTime={time} />
    );
  } catch (err) {
    if (options.showFlashOnError) Flash("default", err.message);
  }
}