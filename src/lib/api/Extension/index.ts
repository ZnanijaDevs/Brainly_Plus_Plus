import type { ModelTypeID, Subject, BanMessageReason } from "@typings/";
import type { 
  User,
  DeletionReason,
  ViewerDataInPageContext,
  UserAnswerData
} from "@typings/ServerReq";
import { getUserAuthToken } from "@utils/getViewer";

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
    banMessage: {
      reminders: string[];
      accountWillBeDeleted: string;
      endings: string[];
      greetings: string[];
      reasons: BanMessageReason[];
    }
  };
}

export type UserAnswersDataType = {
  count: number;
  fetchedCount: number;
  answers: UserAnswerData[];
}

type AuthDataType = {
  privileges: number[];
  brainlyId: number;
  isDeveloper: boolean;
  isMentor: boolean;
  isModerator: boolean;
  isSeniorMentor: boolean;
}

class ServerReq {
  private readonly serverApiURL = `${API_SERVER}/api`;

  private me: User;
  private authToken: string;

  get userToken() {
    return this.authToken;
  }

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

  async GetMyAuthData() {
    return await this.Req<AuthDataType>("GET", "me/privileges");
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

  async GetUserAnswers(userId: number) {
    return await this.Req<UserAnswersDataType>("GET", `brainly/userContent/answers/${userId}`);
  }

  async GetViewerPageContext() {
    return await this.Req<PageContextDataType>("POST", "me/context");
  }
}

export default new ServerReq();