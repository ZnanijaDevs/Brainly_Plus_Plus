import chalk from "chalk";

import ServerReq from "@lib/api/Extension";
import _API from "@lib/api/Brainly/Legacy";

import InjectToDOM from "@lib/InjectToDOM";
import Flash from "@utils/flashes";
import { getUserAuthToken } from "@utils/getViewer";

import ReplaceModerationButtons from "./Task/Moderation";

class Core {
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

    const [pageContext, me] = await Promise.all([ // TODO: handle errors
      ServerReq.GetViewerPageContext(),
      _API.GetMe()
    ]);

    const viewer = pageContext.viewer;
    const market = pageContext.market;

    const deletionReasons = pageContext.deletionReasons;
    const deletionReasonsAsArray = [];

    for (let modelId in deletionReasons) {
      for (let reason of deletionReasons[modelId]) {
        deletionReasonsAsArray.push(...reason.subcategories);
      }
    }
    
    globalThis.System = {
      userAvatar: me.user.avatar?.[100],
      rankings: market.rankings,
      grades: market.grades,
      subjects: market.subjects,
      specialRanks: market.specialRanks,
      token: userToken,
      viewer: {
        ...viewer,
        canApprove: me.privileges.includes(146) && viewer.isModerator,
        canAccept: viewer.privileges.includes(16),
        canUnapprove: me.privileges.includes(147) && viewer.isModerator,
      },
      deletionReasonsByModelId: pageContext.deletionReasons,
      deletionReasons: deletionReasonsAsArray,
      me,
    };

    console.log(chalk.bgCyan.black.bold("page context"), System);
  }
}

new Core();