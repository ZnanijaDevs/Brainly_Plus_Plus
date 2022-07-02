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

/* actions_count: 0
avatar: "https://ru-static.z-dn.net/files/d76/a707e0657632965b0fa7919224b4f0b4.jpg"
brainly_id: "dXNlcjoyNTUzODU1OQ=="
created_at: "2022-07-01T12:10:30.688000+00:00"
id: "2be2e020-34b3-46b9-a229-a5d3b301e702"
is_developer: false
is_mentor: false
is_moderator: false
nick: "FaerVator"
privileges: [1]
0: 1
ranks: ["Антиспамер", "главный мозг"]
status: "DEACTIVATED"
updated_at: "2022-07-01T12:28:18.519000+00:00"*/

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