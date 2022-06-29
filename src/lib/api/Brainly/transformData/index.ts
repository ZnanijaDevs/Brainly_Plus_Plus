import type { CommonDataInTicketType, ReportDataInModerationTicket } from "@typings/";
import type { UserDataType, Task, Comment, Response } from "@typings/Brainly";

import transformAttachment from "./transformAttachment";
import transformUser from "./transformUser";

export function transformNodeInModerationTicket(
  data: Task | Response | Comment,
  usersData: UserDataType[]
): CommonDataInTicketType {
  let modelType: CommonDataInTicketType["modelType"];
  let modelTypeId: CommonDataInTicketType["modelTypeId"];

  if ("grade_id" in data) {
    modelType = "question";
    modelTypeId = 1;
  } else if ("attachments" in data) {
    modelType = "answer";
    modelTypeId = 2;
  } else {
    modelType = "comment";
    modelTypeId = 45;
  }

  // Find report and abuse details
  let report: ReportDataInModerationTicket;
  if (data.report) {
    let abuseDetails = data.report.abuse.data;

    if (/mobile/i.test(abuseDetails)) abuseDetails = "";

    report = {
      user: transformUser(usersData.find(user => user.id === data.report.user.id)),
      date: data.report.created,
      abuseName: data.report.abuse.name,
      abuseDetails
    };
  }

  const transformedNode: CommonDataInTicketType = {
    modelType,
    modelTypeId,
    id: data.id,
    content: data.content
      .replace(/(?<=<img src=')http/g, "https")
      .replace(/(<br\s?\/>){2,}(?=$|\u200B)/g, ""),
    created: data.created,
    isReported: !!data.report,
    author: {
      ...transformUser(
        usersData.find(userData => userData.id === data.user_id)
      ),
    },
    points: (data as Task).points?.ptsForTask,
    deleted: (data as Comment).deleted ?? false,
    report
  };

  if (modelType === "answer") {
    let answer = data as Response;

    transformedNode.taskId = answer.task_id;
    transformedNode.edited = !!answer.edited;

    let wrongReport = answer.wrong_report;
    if (wrongReport) {
      transformedNode.correction = {
        moderator: transformUser(
          usersData.find(user => user.id === wrongReport.user.id)
        ),
        reason: wrongReport.reason,
        date: wrongReport.reported
      };
    }
  }

  if (modelType !== "comment") {
    const attachmentsList = (data as Task | Response).attachments;
    const commentsList = (data as Task | Response).comments;

    transformedNode.attachments = attachmentsList.map(transformAttachment);
    transformedNode.comments = commentsList.map(comment => 
      transformNodeInModerationTicket(comment, usersData)
    );
  }

  return transformedNode;
}