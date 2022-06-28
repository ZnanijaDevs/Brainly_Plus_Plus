import extension from "webextension-polyfill";

/**
 * Send a message to the extension background
 */
export default async (
  messageType: string,
  data?
) => {
  return await extension.runtime.sendMessage({
    type: messageType,
    data: data
  });
};