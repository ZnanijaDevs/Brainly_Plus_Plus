import chalk from "chalk";

import ToBackground from "@lib/ToBackground";
import Flash from "@utils/flashes";
import { getUserAuthToken } from "@utils/getViewer";

import ReplaceModerationButtons from "./Task/Moderation";

const addWindowLoadedListener = (handler: () => void) => {
  window.onload = handler;
};

class Core {
  private viewerAuthToken: string;

  private path = window.location.href;
  private jsFiles: string[] = [];
  private cssFiles: string[] = [];

  private Path(pattern: RegExp): boolean {
    return pattern.test(this.path);
  }

  constructor() {
    this.Init();
  }

  async Init() {
    await this.AuthUser();

    if (this.Path(/\/$|(predmet\/\w+$)/)) {
      this.addInjectedFiles([
        "content-scripts/HomePage/index.js",
        "styles/HomePage/index.css"
      ]);
    }

    if (this.Path(/\/task\/\d+/)) {
      ReplaceModerationButtons();

      this.addInjectedFiles([
        "content-scripts/Task/index.js",
        "styles/Task/index.css"
      ]);
    }

    this.addInjectedFiles([
      // "content-scripts/Shared/ModerationPanel/index.js",
      "styles/ModerationTicket/index.css"
    ]);

    addWindowLoadedListener(this.injectFilesWhenPageLoaded.bind(this));

  
    /*if (this.Path(/\/users\/user_content\/[1-9]\d*\/?/)) {
      this.AddInjectedFiles([
        "content-scripts/UserContent/index.js"
      ]);
    }

    if (this.Path(/\/task\/\d+/)) {
      this.AddInjectedFiles([
        "content-scripts/Task/index.js",
        "styles/Task/index.css"
      ]);
    }

    if (this.Path(/\/profil\/[A-Za-zа-яА-Я0-9]+-\d+/)) {
      this.AddInjectedFiles([
        "content-scripts/UserProfile/index.js"
      ]);
    }

    this.AddInjectedFiles([
      "content-scripts/Shared/ModerationPanel/index.js",
      "styles/ModerationPanel/index.css",
      "styles/ModerationTicket/index.css"
    ]);*/
  }

  async AuthUser() {
    const userToken = await getUserAuthToken();
    if (!userToken) {
      addWindowLoadedListener(() => 
        Flash("error", locales.youDoNotHavePermissionToUseThisExt, {
          sticky: true,
          withIcon: true
        })
      );

      throw Error("Seems like you are not authorized");
    }

    this.viewerAuthToken = userToken;
  }

  addInjectedFiles(files: string[]) {
    this.jsFiles.push(
      ...files.filter(file => file.match(/\.js$/))
    );
    this.cssFiles.push(
      ...files.filter(file => file.match(/\.css$/))
    );
  }

  injectFilesWhenPageLoaded() {
    if (this.cssFiles.length) ToBackground("InjectStyles", this.cssFiles);
    ToBackground("InjectScripts", this.jsFiles);

    console.log(
      chalk.blue.bgWhite("[Brainly++] Injected files"),
      { css: this.cssFiles, js: this.jsFiles }
    );
  }
}

new Core();