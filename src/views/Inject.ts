import chalk from "chalk";

import ServerReq from "@lib/api/Extension";
import _API from "@lib/api/Brainly/Legacy";

import InjectToDOM from "@lib/InjectToDOM";
import flash from "@utils/flashes";
import storage from "@lib/storage";
import { getUserAuthToken } from "@utils/getViewer";
import ReplaceModerationButtons from "./Task/Moderation";

import type { CustomDeletionReason } from "@typings/";
import createProfileLink from "@utils/createProfileLink";

const CUSTOM_DELETION_REASONS_CATEGORY_ID = 999;

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
    await this.SetUserCustomDeletionReasons();

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
      flash("error", locales.youDoNotHavePermissionToUseThisExt, {
        sticky: true,
        withIcon: true
      });

      throw Error("Seems like you are not authorized");
    }

    try {
      const [pageContext, me] = await Promise.all([
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
        marketHost: market.host,
        marketBaseUrl: `https://${market.host}`,
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
        userLink: createProfileLink(me.user.id, me.user.nick),
        checkP: privilegeId => viewer.privileges.includes(privilegeId),
        banMessage: market.banMessage
      };

      console.log(chalk.bgCyan.black.bold("page context"), System);
    } catch (err) {
      flash("default", err, { withIcon: true });

      throw err;
    }
  }

  async SetUserCustomDeletionReasons() {
    const reasons = await storage.get<CustomDeletionReason[]>("customDeletionReasons");
    if (!reasons?.length || !System.checkP(6)) return;

    const reasonsByModelId = System.deletionReasonsByModelId;

    for (let modelType in reasonsByModelId) {
      const subcategories = reasons.filter(reason => reason.modelType === +modelType);
      if (!subcategories?.length) continue;

      reasonsByModelId[modelType].push({
        id: CUSTOM_DELETION_REASONS_CATEGORY_ID,
        text: locales.other,
        subcategories: subcategories.map((subcategory: CustomDeletionReason, index) => 
          ({
            title: subcategory.title,
            takePoints: subcategory.takePoints,
            withWarn: subcategory.withWarn,
            returnPoints: subcategory.returnPoints,
            id: CUSTOM_DELETION_REASONS_CATEGORY_ID + index,
            matchText: "__",
            text: subcategory.text
          })
        )
      });
    }
  }
}

new Core();