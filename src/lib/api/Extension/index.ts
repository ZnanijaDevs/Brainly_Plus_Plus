import type { ModelTypeID, Subject } from "@typings/";
import type { 
  User,
  AnswerDataInUserContent,
  QuestionDataInUserContent,
  DeletionReason,
  ViewerDataInPageContext
} from "@typings/ServerReq";
import { getUserAuthToken } from "@utils/getViewer";

export type UserContentDataType = {
  answers: {
    count: number;
    items: AnswerDataInUserContent[];
  };
  questions: {
    count: number;
    items: QuestionDataInUserContent[];
  }
}

export type PageContextDataType = {
  timestamp: number;
  viewer: ViewerDataInPageContext;
  deletionReasons: {
    [x in ModelTypeID]: DeletionReason[];
  };
  market: {
    host: string;
    market: string;
    subjects: Subject[];
    grades: {
      [x: string]: string;
    };
    specialRanks: string[];
    rankings: {id: number; name: string}[];
  };
}

class ServerReq {
  private readonly serverApiURL = "https://app.br-helper.com/api";

  private me: User;
  private authToken: string;

  private async Req<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    apiMethod: string,
    data?
  ): Promise<T> {
    if (!this.authToken)
      this.authToken = await getUserAuthToken();

    const response = await fetch(`${this.serverApiURL}/${apiMethod}`, {
      method,
      body: data ? JSON.stringify(data) : null,
      headers: {
        "Authorization": `Bearer ${this.authToken}`,
        "X-Extension-Version": EXTENSION_VERSION
      }
    });

    let responseStatus = response.status.toString();

    if (responseStatus.startsWith("5") || responseStatus === "404") 
      throw Error(locales.errors.unexpectedError);
      
    const res = await response.json();

    if (!responseStatus.startsWith("2")) throw Error(res?.error);

    return res;
  }

  async GetMe() {
    if (!this.me)
      this.me = await this.Req<User>("GET", "me");

    return this.me;
  }

  async GetUsers({ cursor, limit }: {
    cursor?: string;
    limit?: string;
  }) {
    return await this.Req<{
      cursor?: string;
      count: number;
      users: User[];
    }>(
      "GET",
      `users?limit=${limit ?? 25}${cursor ? `&cursor=${cursor}` : ""}`
    );
  }

  async GetMyMentees() {
    return await this.Req<User[]>("GET", "mentees/myMentees");
  }

  async GetMentees(mentorId: number) {
    return await this.Req<User[]>("GET", `mentees?mentorId=${mentorId}`);
  }

  async SearchUser(nick: string) {
    return await this.Req<User[]>("GET", `users/search/${nick}`);
  }

  async GetUserByBrainlyId(id: number) {
    return await this.Req<User>("GET", `users/getByBrainlyId?id=${id}`);
  }

  async AddUser(data: {
    id: number;
    privileges: number[];
  }) {
    return await this.Req<User>("POST", "users", data);
  }

  async DeleteUser(userId: number) {
    return await this.Req<{
      deleted: boolean;
      user: User;
    }>("DELETE", `users/${userId}`);
  }

  async GetUserContent(userId: number) {
    return await this.Req<UserContentDataType>("GET", `brainly/user_content/${userId}`);
  }

  async GetViewerPageContext() {
    return await this.Req<PageContextDataType>("POST", "me/context");
  }
}

export default new ServerReq();