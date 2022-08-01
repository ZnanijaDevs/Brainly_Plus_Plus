export interface User {
  createdAt: string;
  updatedAt: string;
  brainlyId: number;
  avatar: string;
  ranks: string[];
  privileges: number[];
  nick: string;
  actions: {
    daily: number[];
    monthly: number[];
    weekly: number[];
  };
  previousNicks: string[];
  notes: unknown[]; // TODO: add notes
  brainlyData: {
    id: string;
    databaseId: number;
    gender: "MALE" | "FEMALE";
    points: number;
    grade: string;
    thanksCount: number;
  };
  mentorId?: number;
  _id: string;
  isMentor: boolean;
  isModerator: boolean;
  isSeniorMentor: boolean;
  isDeveloper: boolean;
}

export interface DeletionSubcategory {
  id: number;
  takePoints: boolean;
  withWarn: boolean;
  returnPoints?: boolean;
  text: string;
  title: string;
  matchText: string;
}

export interface DeletionReason {
  id: number;
  text: string;
  subcategories: DeletionSubcategory[];
}

export interface ViewerDataInPageContext {
  brainlyId: number;
  canDeleteCommentsInBulk: boolean;
  canSendAnswersForCorrection: boolean;
  isModerator: boolean;
  nick: string;
  privileges: number[];
  ranks: string[];
}

export interface UserAnswerData {
  content: string;
  hasAttachments: boolean;
  id: number;
  isApproved: boolean;
  isBest: boolean;
  isReported: boolean;
  rating: number;
  thanksCount: number;
  question: {
    id: string;
    databaseId: number;
    link: string;
  }
}