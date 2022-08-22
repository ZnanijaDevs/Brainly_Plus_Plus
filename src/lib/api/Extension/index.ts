import type { ModelTypeID, Subject, BanMessageReason } from "@typings/";
import { User, DeletionReason, UserAnswerData, Candidate } from "@typings/ServerReq";
import { getUserAuthToken } from "@utils/getViewer";

export type PageContextDataType = {
  viewer: User;
  deletionReasons: {
    [x in ModelTypeID]: DeletionReason[];
  };
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
  };
  server: {
    timestamp: string;
    timezone: string;
  };
  market: {
    contentClassificationRestEndpoint: string;
    graphqlEndpointURL: string;
    host: string;
    legacyAPIEndpointURL: string;
  }
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
  private readonly serverURL = "https://app.br-helper.com";

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

    const response = await fetch(`${this.serverURL}/${apiMethod}`, {
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
    return await this.Req<User[]>("GET", `mentees/${mentorId}`);
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

  async UpdateUser(data: {
    userId: number;
    privileges: number[];
  }) {
    return await this.Req<User>("PUT", `users/${data.userId}`, {
      privileges: data.privileges
    });
  }

  async DeleteUser(userId: number) {
    return await this.Req<{ deleted: boolean; user: User }>("DELETE", `users/${userId}`);
  }

  async GetUserAnswers(userId: number) {
    return await this.Req<UserAnswersDataType>("GET", `brainly/userContent/answers/${userId}`);
  }

  async GetViewerPageContext() {
    return await this.Req<PageContextDataType>("GET", "me/context");
  }

  async GetCandidates() {
    return await this.Req<Candidate[]>("GET", "candidates");
  }

  async GetCandidateById(id: number) {
    return await this.Req<{ candidate?: Candidate }>("GET", `candidates/${id}`);
  }
}

export default new ServerReq();