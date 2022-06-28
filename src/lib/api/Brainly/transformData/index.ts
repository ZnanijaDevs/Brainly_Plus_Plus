import type { CommonDataInTicketType } from "@typings/";
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

  const transformedNode: CommonDataInTicketType = {
    modelType,
    modelTypeId,
    id: data.id,
    content: data.content
      .replace(/(?<=<img src=')http/g, "https"),
    created: data.created,
    isReported: !!data.report,
    author: {
      ...transformUser(
        usersData.find(userData => userData.id === data.user_id)
      ),
    },
    taskId: (data as Response).task_id || data.id,
    points: (data as Task).points?.ptsForTask,
    deleted: (data as Comment).deleted ?? false
  };

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