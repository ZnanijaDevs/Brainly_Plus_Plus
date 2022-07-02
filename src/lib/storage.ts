import ext from "webextension-polyfill";

export interface ExtensionConfigDataInStorage {
  searchEngine: "yandex" | "google";
  newModPanelEnabled: boolean;
  slackToken: string;
  authToken: string;
}

const get = async <T>(key: keyof ExtensionConfigDataInStorage): Promise<T> => {
  const storage = await ext.storage.sync.get(key);

  return storage?.[key];
};

const set = async (data: Partial<ExtensionConfigDataInStorage>) => {
  return await ext.storage.sync.set(data);
};

export default { get, set };