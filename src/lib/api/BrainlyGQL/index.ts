import cookies from "js-cookie";

const GRAPHQL_ENDPOINT_URL = "/graphql/ru";
const USER_TOKEN_LONG = cookies.get("Zadanepl_cookie[Token][Long]");

export default async <T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> => {
  const res = await fetch(GRAPHQL_ENDPOINT_URL, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-B-Token-Long": USER_TOKEN_LONG,
    },
    body: JSON.stringify({
      query,
      variables
    })
  });

  const data = await res.json();

  return data.data;
};