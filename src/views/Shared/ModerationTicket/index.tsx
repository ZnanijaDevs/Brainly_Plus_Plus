import chalk from "chalk";
import { createRoot } from "react-dom/client";

import _API from "@api/Brainly/Legacy";

import type { ModerationTicketContextDataType } from "@typings/";
import { transformNodeInModerationTicket } from "@api/Brainly/transformData";
import transformQuestionLogEntries from "@api/Brainly/transformData/transformQuestionLogEntries";
import { gradeById, subjectById } from "@utils/getMarketConfig";

import Ticket from "./Ticket";

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
            entry.type === 90
          )
        })
      ),
      logEntries: transformQuestionLogEntries(questionLog.data, questionLog.users_data),
      grade: gradeById(task.grade_id),
      subject: subjectById(task.subject_id),
    };

    console.log(
      chalk.black.bgCyan(`Moderation ticket context for #${questionId}`), 
      context
    );

    const ticketRootElement = document.createElement("div");
    ticketRootElement.id = "moderation-ticket-popup";

    const ticketRoot = createRoot(ticketRootElement);
    document.body.appendChild(ticketRootElement);

    ticketRoot.render(
      <Ticket questionId={questionId} context={context} expiryTime={time} root={ticketRoot} />
    );

    document.body.style.overflow = "hidden";
  } catch (err) {
    console.error(err);
    if (options.showFlashOnError) flash("default", err.message);
  }
}