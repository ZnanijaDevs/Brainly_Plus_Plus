import type { ModelTypeID } from "@typings/";
import type { 
  MeDataType, 
  UserDataType, 
  ModerationTicketDataType, 
  QuestionLogEntry 
} from "@typings/Brainly";

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
    const requestUrl = `${this.apiEndpoint}/${apiMethod}?client=moderator-extension`;
    const requestOptions: RequestInit = {
      method,
      credentials: "include",
      body: data ? JSON.stringify(data) : null,
      headers: new Headers({
        "X-Extension-Used": `Brainly_Plus_Plus/${EXTENSION_VERSION}`
      })
    };

    const r = await fetch(requestUrl, requestOptions).then(r => r.json());
    if (!r.success) {
      console.warn(
        `An error has occured: ${r.message}`,
        r
      );

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
}

export default new BrainlyApi();