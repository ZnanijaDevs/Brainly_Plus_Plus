/* eslint-disable camelcase */
export type UserStatus = "PENDING_ACTIVATION" | "ACTIVE" | "DEACTIVATED";

export interface User {
  actions_count: number;
  avatar: string;
  brainly_id: string;
  created_at: string;
  updated_at: string;
  id: string;
  is_developer: boolean;
  is_mentor: boolean;
  is_moderator: boolean;
  nick: string;
  privileges: number[];
  ranks: string[];
  status: UserStatus;
}

/* export interface Report {
  created: string;
  reason: string;
  reporter: User;
  riskCategories?: string[];
  type: "USER_REPORT" | "AUTOMATIC_REPORT";
}

export interface Comment {
  content: string;
  deleted: boolean;
  id: number;
  author: User;
}

export interface Subject {
  name: string;
  icon: string;
}

export interface UserContentCategoryEntry<T> {
  count: number;
  items: T[];
}

export interface User {
  avatar: string;
  created: string;
  id: number;
  isModerator: boolean;
  nick: string;
  points: number;
  ranks: string[];
  userContent: {
    answers?: UserContentCategoryEntry<{
      content: string;
      hasAttachments: boolean;
      isApproved: boolean;
      isBest: boolean;
      isReported: boolean;
      questionId: number;
    }>;
    comments?: null;
    questions?: UserContentCategoryEntry<{
      answersCount: number;
      content: string;
      created: string;
      hasApprovedAnswers: boolean;
      id: number;
      subject: Subject;
    }>;
  }
}

export interface Attachment {
  extension: string;
  thumbnailUrl: string;
  type: "IMAGE" | "DOCUMENT" | "FILE" | "UNKNOWN";
  url: string;
  viewUrl?: string;
}

export type QuestionNodeDataType = {
  content: string;
  isReported: boolean;
  attachments: Attachment[];
  author: User;
  id: number;
  created: string;
  comments: {
    count: number;
    cursor?: string;
    hasMore: boolean;
    items: Comment[];
  };
  reports: Report[];
} & Partial<{
  isApproved: boolean;
  isBest: boolean;
  rating: boolean;
  thanksCount: number;
}> & Partial<{
  subject: Subject;
  points: number;
  grade: string;
}>;

export interface QuestionWithExtraContentDataType {
  question: QuestionNodeDataType;
  answers: {
    count: number;
    items: QuestionNodeDataType[];
  }
}*/ 