import type { QuestionWithExtraContentDataType } from "@typings/ServerReq";

class ServerReq {
  private readonly serverApiURL = "http://localhost:8000/api";

  private async Req<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" = "GET",
    apiMethod: string,
    data?
  ): Promise<T> {
    const r = await fetch(`${this.serverApiURL}/${apiMethod}`, {
      method,
      body: data ? JSON.stringify(data) : null
    })
      .then(resp => resp.json());

    if (r.error) throw Error(r.error);

    return r;
  }

  async GetQuestionContent(id: number) {
    return await this.Req<QuestionWithExtraContentDataType>("GET", `tickets/question/${id}`);
  }

  async DetectImagesFromCalculators(urlList: string[]) {
    return await this.Req("POST", "ai/predict/calculators", {
      urlList
    });
  }

}

export default new ServerReq();