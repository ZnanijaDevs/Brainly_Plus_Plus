import chalk from "chalk";

import ToBackground from "@lib/ToBackground";
import Flash from "@utils/flashes";
import { getUserAuthToken } from "@utils/getViewer";

import ReplaceModerationButtons from "./Task/Moderation";

/**
 * Inject files (content scripts and stylesheets) to DOM
 * @param files An array of files
 */
async function InjectToDOM(files: string[]) {
  const jsFiles = files.filter(file => file.match(/\.js$/));
  const cssFiles = files.filter(file => file.match(/\.css$/));

  if (cssFiles.length) await ToBackground("InjectStyles", cssFiles);
  if (jsFiles.length) await ToBackground("InjectScripts", jsFiles);
}

class Core {
  private viewerAuthToken: string;

  private path = window.location.href;

  private checkRoute(pattern: RegExp): boolean {
    return pattern.test(this.path);
  }

  constructor() {
    this.Init();
  }

  async Init() {
    await this.AuthUser();

    if (this.checkRoute(/\/$|(predmet\/\w+$)/)) {
      await InjectToDOM([
        "content-scripts/HomePage/index.js",
        "styles/HomePage/index.css"
      ]);
    }

    if (this.checkRoute(/\/task\/\d+/)) {
      ReplaceModerationButtons();

      await InjectToDOM([
        "content-scripts/Task/index.js",
        "styles/Task/index.css"
      ]);
    }

    await InjectToDOM([
      "styles/ModerationTicket/index.css"
    ]);
  }

  async AuthUser() {
    const userToken = await getUserAuthToken();
    if (!userToken) {
      Flash("error", locales.youDoNotHavePermissionToUseThisExt, {
        sticky: true,
        withIcon: true
      });

      throw Error("Seems like you are not authorized");
    }

    this.viewerAuthToken = userToken;
    console.log(chalk.bgRed.bold("User token"), userToken);
  }
}

new Core();