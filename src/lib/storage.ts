import ext from "webextension-polyfill";

const get = async <T>(key: string): Promise<T> => {
  const storage = await ext.storage.local.get(key);

  return storage?.[key];
};

const set = async (key: string, data) => {
  return await ext.storage.local.set({ 
    [key]: data 
  });
};

export default { get, set };