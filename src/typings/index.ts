import type { EntriesByDateDataType } from "@lib/api/Brainly/transformData/transformQuestionLogEntries";

export interface Warn {
  time: string;
  reason: string;
  content: string;
  taskId: number;
  warner: string;
  active: boolean;
}

export type ModelTypeID = 1 | 2 | 45;

export type AnswerCorrectionDataType = {
  date: string;
  moderator: UserDataInModerationTicket;
  reason: string;
};

export type ReportDataInModerationTicket = {
  user: UserDataInModerationTicket;
  abuseName: string;
  abuseDetails?: string;
  date: string;
};

export type AttachmentDataInModerationTicket = {
  extension: string;
  thumbnailUrl: string;
  type: "IMAGE" | "DOCUMENT" | "FILE" | "UNKNOWN";
  url: string;
  viewUrl?: string;
  id: number;
};

export type UserDataInModerationTicket = {
  nick: string;
  isModerator: boolean;
  id: number;
  profileLink: string;
  gender: 1 | 2;
  isDeleted: boolean;
  avatar: string;
  ranks: string[];
  rankColor: string;
};

export type CommonDataInTicketType = {
  modelType: "question" | "answer" | "comment";
  modelTypeId: ModelTypeID;
  id: number;
  content: string;
  created: string;
  isReported: boolean;
  author: UserDataInModerationTicket;
  attachments?: AttachmentDataInModerationTicket[];
  comments?: CommonDataInTicketType[];
  deleted?: boolean;
  report: ReportDataInModerationTicket;
} & Partial<{
  isApproved: boolean;
  isBest: boolean;
  taskId: number;
  thanksCount: number;
  edited?: boolean;
  correction?: AnswerCorrectionDataType;
}> & Partial<{
  points: number;
}>;

export type ModerationTicketContextDataType = {
  ticketData: {
    id: number;
    timeLeft: number;
  };
  taskLink: string;
  task: CommonDataInTicketType;
  answers: CommonDataInTicketType[];
  logEntries: EntriesByDateDataType;
  grade: string;
  subject: {
    name: string;
    icon: string;
  };
  privileges: number[];
}