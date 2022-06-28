import type { EntriesByDateDataType } from "@lib/api/Brainly/transformData/transformQuestionLogEntries";

export type ModelTypeID = 1 | 2 | 45;

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
} & Partial<{
  isApproved: boolean;
  isBest: boolean;
  taskId: number;
  thanksCount: number;
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
  }
}