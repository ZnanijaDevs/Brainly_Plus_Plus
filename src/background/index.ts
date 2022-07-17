import ext from "webextension-polyfill";

import storage from "@lib/storage";
import setConfigOnInstall from "./setConfigOnInstall";

class BackgroundListener {
  private tabId: number;
  private messageData;

  constructor() {
    this.bindListeners();
  }

  private bindListeners() {
    this.bindListener("InjectStyles", this.injectStyles);
    this.bindListener("InjectScripts", this.injectScripts);
    this.bindListener("CheckForPlagiarism", this.checkForPlagiarism);

    ext.runtime.onInstalled.addListener(details => {
      // If this line is commented out, data in storage will be overwritten with each extension update.
      // This line should be uncommented in production
      if (details.reason !== "install") return;

      setConfigOnInstall();
    });
  }

  private bindListener(type: string, func: () => Promise<unknown>) {
    ext.runtime.onMessage.addListener((message, sender) => {
      if (message.type !== type) return;

      this.messageData = message.data;
      this.tabId = sender.tab.id;

      console.debug(`[${type}] Got a message from tab ${this.tabId}`, this.messageData);
    
      return func.bind(this)();
    });
  }

  private async injectStyles() {
    return await ext.scripting.insertCSS({ 
      files: this.messageData, 
      target: { tabId: this.tabId }
    });
  }

  private async injectScripts() {
    return await ext.scripting.executeScript({ 
      files: this.messageData, 
      target: { tabId: this.tabId } 
    });
  }

  private async checkForPlagiarism() {
    let { 
      date, 
      content 
    } = this.messageData as { date: string; content: string; };
  
    content = content
      .replace(/\r?\n?(відповідь|ответ|пояснення|(пошаговое\s)?объяснение):/gi, "")
      .replace(/<\/?\w+\s?\/?>/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();

    const splittedDate = date.split("T")[0].split("-");

    let searchEngine = await storage.get("searchEngine");
    let url;

    if (searchEngine === "yandex") {
      let encodedQuery = encodeURIComponent(`"${content}" date<${splittedDate.join("")}`);
      url = `https://yandex.ru/search/?text=${encodedQuery}`;
    } else {
      let d = new Date(splittedDate.join("/"));
      d.setDate(d.getDate() - 1);

      let formattedDate = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;

      url = encodeURI(
        `https://google.com/search?q="${content}"&tbs=cdr:1,cd_min:,cd_max:${formattedDate}`
      );
    }
    
    ext.tabs.create({ url });
  }
}

new BackgroundListener();