import { scripting } from "webextension-polyfill";

export default async ({ tabId, files }: {
  tabId?: number;
  files: string[];
}) => {
  await scripting.insertCSS({ 
    files: files, 
    target: { tabId }
  });
};