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
  brainlyData: {
    gender: "MALE" | "FEMALE";
    created: string;
    isCommunityContributor: boolean;
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

export interface Candidate {
  znanijaId: number;
  id: string;
  nick: string;
  status: string;
}