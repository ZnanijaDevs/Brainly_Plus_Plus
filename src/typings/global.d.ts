import type { DeletionReason, DeletionSubcategory, ViewerDataInPageContext } from "./ServerReq";
import type { ModelTypeID, Subject } from "./";
import type { MeDataType } from "./Brainly";

declare global {
  const EXTENSION_VERSION: string;
  const locales: typeof import("../locales").locales;

  // eslint-disable-next-line no-var
  var System: {
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
  };
}

export {};