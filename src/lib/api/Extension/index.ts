import type { 
  User,
  AnswerDataInUserContent,
  QuestionDataInUserContent
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
};

class ServerReq {
  private readonly serverApiURL = "https://ext.br-helper.com/api";

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
      
    const res = await response.json();

    if (response.status !== 200) throw Error(res?.detail);

    return res;
  }

  async DetectImagesFromCalculators(urlList: string[]) {
    return await this.Req("POST", "ai/predict/calculators", {
      urlList
    });
  }

  async GetUsers({
    lastId = null, 
    includeDeactivated = false, 
    limit = 25
  }: Partial<{
    lastId: string;
    includeDeactivated: boolean;
    limit: number;
  }>) {
    return await this.Req<User>(
      "GET", 
      `users?include_deactivated=${includeDeactivated}&limit=${limit}&last_id=${lastId}`
    );
  }

  async SearchUser(nick: string) {
    return await this.Req<User[]>("GET", `users/search/${nick}`);
  }

  async EditUser(user: {
    id: string;
    deactivated: boolean;
    privileges: number[];
  }) {
    return await this.Req<User>("PUT", `users/${user.id}`, {
      deactivated: user.deactivated,
      privileges: user.privileges
    });
  }

  async AddUser({ 
    id, privileges 
  }: { id: number; privileges: number[]; }) {
    return await this.Req<User>("POST", "users/add", {
      id,
      privileges
    });
  }

  async GetMe() {
    if (!this.me)
      this.me = await this.Req<User>("GET", "me");

    return this.me;
  }

  async GetUserByBrainlyID(id: number) {
    return await this.Req<User>("GET", `users/get_by_brainly_id?id=${id}`);
  }

  async GetUserContent(userId: number) {
    return await this.Req<UserContentDataType>("GET", `brainly/user_content/${userId}`);
  }
}

export default new ServerReq();