import storage from "@lib/storage";
import ServerReq from "@api/Extension";

import type { User } from "@typings/ServerReq";

export const getUserAuthToken = async (): Promise<string> => {
  return await storage.get("authToken");
};

export default async (): Promise<User> => {
  return await ServerReq.GetMe();
};