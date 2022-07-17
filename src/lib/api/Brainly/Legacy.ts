import type { ModelTypeID } from "@typings/";
import type { 
  MeDataType, 
  UserDataType, 
  ModerationTicketDataType, 
  QuestionLogEntry 
} from "@typings/Brainly";
import makeDividedMessages from "@utils/makeDividedMessages";

/* eslint-disable camelcase, no-console */

type LegacyApiSuccessResponse<T> = {
  data: T;
  impl: string;
  protocol: "28";
  schema?: string;
  success: true;
  validated?: boolean;
  users_data?: UserDataType[];
  message?: string;
};

class BrainlyApi {
  private readonly apiEndpoint = "/api/28";
  private user: MeDataType;

  private async Req<T>(
    method: "GET" | "POST" = "GET",
    apiMethod: string,
    data?
  ): Promise<LegacyApiSuccessResponse<T>> {
    let requestUrl = `${this.apiEndpoint}/${apiMethod}`;
    requestUrl += `${requestUrl.includes("?") ? "&" : "?"}client=moderator-extension`;

    const requestOptions: RequestInit = {
      method,
      credentials: "include",
      body: data ? JSON.stringify(data) : null,
      headers: new Headers({
        "X-Extension": `Brainly_Plus_Plus/${EXTENSION_VERSION}`,
        "X-Extension-Version": EXTENSION_VERSION,
      })
    };

    const r = await fetch(requestUrl, requestOptions).then(r => r.json());
    if (!r.success) {
      console.warn(`An error has occured: ${r.message}`, r);

      throw Error(r.message);
    }

    return r;
  }

  async GetMe() {
    if (!this.user) {
      const userData = await this.Req<MeDataType>("GET", "api_users/me");
      this.user = userData.data;
    }

    return this.user;
  }

  async OpenTicket(questionId: number) {
    return await this.Req<ModerationTicketDataType>("POST", "moderation_new/get_content", {
      model_id: questionId,
      model_type_id: 1
    });
  }

  async ExpireTicket(questionId: number) {
    return await this.Req("POST", "moderate_tickets/expire", {
      model_id: questionId,
      model_type_id: 1
    });
  }

  async ProlongTicket({
    taskId, ticketId, minutes
  }: { taskId: number; ticketId: number; minutes: 5 | 10 | 15 }) {
    return await this.Req<{
      id: number;
      time_left: 300 | 600 | 900;
      user_id: number;
    }>("POST", "moderate_tickets/prolong", {
      model_id: taskId,
      model_type_id: 1,
      ticket_id: ticketId,
      time: 60 * minutes
    });
  }

  async DeleteAnswer(data: {
    id: number;
    giveWarn?: boolean;
    takePoints?: boolean;
    reason?: string;
  }) {
    return await this.Req("POST", "moderation_new/delete_response_content", {
      "model_id": data.id,
      "model_type_id": 2,
      "give_warning": data.giveWarn ?? false,
      "take_points": data.takePoints ?? true,
      "reason_id": 0,
      "reason": data.reason ?? ""
    });
  }

  async DeleteQuestion(data: {
    id: number;
    giveWarn?: boolean;
    takePoints?: boolean;
    returnPoints?: boolean;
    reason?: string;
  }) {
    return await this.Req("POST", "moderation_new/delete_task_content", {
      "model_id": data.id,
      "model_type_id": 1,
      "give_warning": data.giveWarn ?? false,
      "take_points": data.takePoints ?? true,
      "reason_id": 0,
      "reason": data.reason ?? "",
      "return_points": data.returnPoints
    });
  }

  async DeleteComment(data: {
    id: number;
    warn?: boolean;
    reason?: string;
  }) {
    const DEFAULT_COMMENT_DELETION_REASON = `
    *Мы вынуждены удалить Ваш комментарий, так как он не отвечает требованиям правил сервиса
    `;

    return await this.Req("POST", "moderation_new/delete_comment_content", {
      model_type_id: 45,
      model_id: data.id,
      give_warning: data.warn ?? false,
      reason: data.reason ?? DEFAULT_COMMENT_DELETION_REASON
    });
  }

  async DeleteAttachment(data: {
    attachmentId: number;
    modelId: number;
    modelTypeId: ModelTypeID;
    taskId: number;
  }) {
    return await this.Req("POST", "moderation_new/delete_attachment", {
      attachment_id: data.attachmentId,
      model_id: data.modelId,
      model_type_id: data.modelTypeId,
      task_id: data.taskId
    });
  }

  async AcceptContent(modelId: number, modelTypeId: ModelTypeID) {
    return await this.Req("POST", "moderation_new/accept", {
      model_id: modelId,
      model_type_id: modelTypeId
    });
  }

  async ApproveAnswer(id: number) {
    return await this.Req("POST", "api_content_quality/confirm", {
      model_type: 2,
      model_id: id
    });
  }

  async UnapproveAnswer(id: number) {
    return await this.Req("POST", "api_content_quality/unconfirm", {
      model_type: 2,
      model_id: id
    });
  }

  async AskForCorrection(answerId: number, reason: string) {
    return await this.Req("POST", "moderation_new/wrong_report", {
      model_type_id: 2,
      model_id: answerId,
      reason
    });
  }

  async GetQuestionLog(questionId: number) {
    return await this.Req<QuestionLogEntry[]>("GET", `api_task_lines/big/${questionId}`);
  }

  async GetConversationIdByUser(userId: number) {
    const conversation = await this.Req<{ conversation_id: number }>("POST", "api_messages/check", {
      user_id: userId
    });

    return conversation.data.conversation_id;
  }

  async SendMessage(userId: number, text: string) {
    const conversationId = await this.GetConversationIdByUser(userId);

    let dividedMessages = makeDividedMessages(text);

    for await (let message of dividedMessages) {
      await this.Req("POST", "api_messages/send", {
        conversation_id: conversationId,
        content: message
      });
    }
  }
}

const _API = new BrainlyApi();

export default _API;