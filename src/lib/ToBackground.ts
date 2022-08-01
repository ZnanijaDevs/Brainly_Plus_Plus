import extension from "webextension-polyfill";
import { BACKGROUND_LISTENERS } from "../background/backgroundListener";

/**
 * Send a message to the extension background
 */
export default async <K extends keyof typeof BACKGROUND_LISTENERS>(
  messageType: K,
  data?: Parameters<typeof BACKGROUND_LISTENERS[K]>[0]
) => {
  return await extension.runtime.sendMessage({
    type: messageType,
    data: data
  });
};