import ext from "webextension-polyfill";
import type { BanMessageReason, CustomDeletionReason } from "@typings/";

export type ExtensionConfigDataInStorage = {
  searchEngine: "yandex" | "google";
  newModPanelEnabled: boolean;
  slackToken: string;
  authToken: string;
  customDeletionReasons: CustomDeletionReason[];
  customBanMessageReasons: BanMessageReason[];
}

const get = async <T extends keyof ExtensionConfigDataInStorage>(
  key: T
): Promise<ExtensionConfigDataInStorage[T]> => {
  const storage = await ext.storage.sync.get(key);

  return storage?.[key];
};

const set = async (data: Partial<ExtensionConfigDataInStorage>) => {
  return await ext.storage.sync.set(data);
};

const getBytesInUse = async () => ext.storage.sync.getBytesInUse();

export default { get, set, getBytesInUse };