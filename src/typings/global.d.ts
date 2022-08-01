import type { DeletionReason, DeletionSubcategory, ViewerDataInPageContext } from "./ServerReq";
import type { ModelTypeID, Subject } from "./";
import type { MeDataType } from "./Brainly";
import type { PageContextDataType } from "@api/Extension";

declare global {
  const EXTENSION_VERSION: string;
  const SENTRY_DSN: string;
  const STYLEGUIDE_VERSION: string;
  const API_SERVER: string;
  const EVENTS_SERVER: string;

  const locales: typeof import("../locales").locales;
  const flash: typeof import("../utils/flashes").flash;

  // eslint-disable-next-line no-var
  var System: {
    marketHost: string;
    marketBaseUrl: string;
    grades: {
      [x: string]: string;
    };
    rankings: {
      id: number;
      name: string;
    }[];
    subjects: Subject[];
    specialRanks: string[];
    deletionReasonsByModelId: {
      [_ in ModelTypeID]: DeletionReason[];
    };
    deletionReasons: DeletionSubcategory[];
    viewer: ViewerDataInPageContext & {
      canApprove: boolean;
      canUnapprove: boolean;
      canAccept: boolean;
    };
    token: string;
    me: MeDataType;
    userAvatar: string;
    checkP: (id: number) => boolean;
    userLink: string;
    banMessage: PageContextDataType["market"]["banMessage"];
  };
}

export {};