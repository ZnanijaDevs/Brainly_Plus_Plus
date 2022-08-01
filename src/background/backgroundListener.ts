import ext from "webextension-polyfill";

import checkForPlagiarism from "./listeners/checkForPlagiarism";
import injectScripts from "./listeners/injectScripts";
import injectStyles from "./listeners/injectStyles";

export const BACKGROUND_LISTENERS = {
  "CheckForPlagiarism": checkForPlagiarism,
  "InjectStyles": injectStyles,
  "InjectScripts": injectScripts
};

export default class BackgroundListener {
  constructor() {
    this.BindListeners();
  }

  BindListeners() {
    for (let listenerName in BACKGROUND_LISTENERS) {
      this.Bind(listenerName, BACKGROUND_LISTENERS[listenerName]);
    }
  }

  Bind<T>(
    messageType: string, 
    listener: (data: T) => Promise<void>
  ) {
    ext.runtime.onMessage.addListener((message, sender) => {
      if (message.type !== messageType) return;
      
      listener({ ...message.data, tabId: sender.tab.id });
    });
  }

}