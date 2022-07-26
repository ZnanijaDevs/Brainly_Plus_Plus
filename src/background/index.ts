import chalk from "chalk";
import ext from "webextension-polyfill";

import ServerReq from "@api/Extension";
import setDefaultConfigInStorage from "./setDefaultConfigInStorage";
import BackgroundListener from "./backgroundListener";

class Background {
  private userToken: string;
  private authed = false;

  constructor() {
    this.Init();
  }

  async Init() {
    setDefaultConfigInStorage();

    await this.CheckUserAuthed();

    new BackgroundListener(); // Init background listeners
  }

  async CheckUserAuthed() {
    try {
      const me = await ServerReq.GetMyAuthData();

      console.log(chalk.green.bold("User authed"), me);

      this.authed = true;
      this.userToken = ServerReq.userToken;

      ext.action.setIcon({ path: { 128: "/icons/icon.png" } });
    } catch (err) {
      console.log(chalk.red.bold("User not authed. All features are turned off!"));
    }
  }
}

new Background();