import { ApolloClient, gql, HttpLink, InMemoryCache, NormalizedCacheObject } from "@apollo/client";
import cookies from "js-cookie";

import DELETE_CONTENT_QUERY from "./queries/DeleteContent.gql";

class GQL {
  private readonly endpointURL = "/graphql/ru";
  private userToken: string = cookies.get("Zadanepl_cookie[Token][Long]");
  
  private client: ApolloClient<NormalizedCacheObject>;

  constructor() {
    const client = new ApolloClient({
      link: new HttpLink({
        uri: this.endpointURL,
        useGETForQueries: true,
        credentials: "include",
        headers: {
          "X-B-Token-Long": this.userToken
        },
      }),
      cache: new InMemoryCache(),
    });

    this.client = client;
  }

  async Query(query: string, variables: Record<string, unknown>) {
    return await this.client.query({
      query: gql(query),
      variables
    });
  }
  
  async Mutate(mutation: string, variables: Record<string, unknown>) {
    return await this.client.mutate({
      mutation: gql(mutation),
      variables
    });
  }

  async DeleteContent(data: {
    id: number;
    contentType: "question" | "answer" | "comment";
    giveWarn?: boolean;
    takePoints?: boolean;
    returnPoints?: boolean;
    reason?: string;
  }) {
    let contentType = data.contentType;

    return await this.Mutate(DELETE_CONTENT_QUERY, {
      input: {
        contentId: data.id,
        giveWarning: data.giveWarn,
        takePoints: data.takePoints,
        returnPoints: data.returnPoints,
        reason: data.reason,
        reasonId: 0,
        contentType,
      }
    });
  }
}

export default new GQL();