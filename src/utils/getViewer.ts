import storage from "@lib/storage";
import ServerReq from "@lib/api/Extension";

import type { User } from "@typings/ServerReq";

export const getUserAuthToken = async (): Promise<string> => {
  return await storage.get<string>("authToken");
};

export default async (): Promise<User> => {
  return await ServerReq.GetMe();
};