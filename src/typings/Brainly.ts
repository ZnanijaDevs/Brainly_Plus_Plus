/* eslint-disable camelcase */
export type QuestionLogEntryClassType = 
  | "accepted"
  | "added"
  | "best"
  | "deleted"
  | "edited"
  | "info"
  | "reported";

export interface QuestionLogEntry {
  class: QuestionLogEntryClassType;
  date: string;
  owner_id: number;
  text: string;
  time: string;
  type: number;
  user_id: number;
  warn: boolean;
  descriptions?: {
    subject: string;
    text: string;
  }[];
}

interface PanelEntryDataType {
  count: number;
  status: number;
}

export type MeDataType = {
  auth: {
    comet: {
      hash: string;
      auth_hash: string;
      avatar_hash: string;
    }
  };
  user_category: number;
  ban: {
    active: boolean;
    expires: null;
  };
  brainlyPlus: {
    subscription?: unknown;
    trialAllowed: true;
  };
  conversations_not_read: number[];
  current_best_answers: number;
  panel: {
    invitations: PanelEntryDataType;
    messages: PanelEntryDataType;
    notifications: PanelEntryDataType;
  };
  privileges: number[];
  responses: number;
  tasks: number;
  comments: number;
  subscription?: unknown;
  preferences: {
    stream: {
      subject_ids: number[];
      grade_ids: number[];
    };
  };
  user: UserDataType & {
    avatar_id: number;
    activated: boolean;
    category: number;
    client_type: number;
    entry: number;
    fb_id?: unknown;
    grade_id: number;
    is_deleted: false
    iso_locale: string;
    language: string;
    mod_actions_count: number;
    points: number;
    primary_rank_id: number;
    registration_datetime: string;
    username: string;
  };
};

export type UserAvatarsDataType = {
  64?: string;
  100?: string;
}

export type UserDataType = {
  avatar: UserAvatarsDataType;
  avatars: UserAvatarsDataType;
  gender: 1 | 2;
  id: number;
  nick: string;
  ranks_ids: number[];
  ranks: {
    color: string;
    names: string[];
    count: number;
  };
  is_deleted?: boolean;
  stats?: {
    questions: number;
    answers: number;
    comments: number;
  }
};

export type DeletionReasonsDataType = {
  abuse_category_id: number;
  id: number;
  text: string;
  subcategories: {
    id: number;
    title: string;
    text: string;
  }[];
};

export interface Attachment {
  full: string;
  hash: string;
  extension: string;
  id: number;
  size: number;
  thumbnail?: string;
  type: string;
}

interface UserDataInModerationTicket {
  id: number;
  removed_contents_count: number;
  reports_count: number;
  successfull_reports_count: number;
  warnings_count: number;
}

interface ReportInModerationTicketDataType {
  created: string;
  abuse: {
    category_id: number;
    data?: string;
    name: string;
    subcategory_id: number;
  };
  user: UserDataInModerationTicket;
}

export interface Comment {
  id: number;
  user_id: number;
  content: string;
  created: string;
  deleted: boolean;
  report?: ReportInModerationTicketDataType;
}

export interface Task {
  attachments: Attachment[];
  content: string;
  created: string;
  grade_id: number;
  id: number;
  points: {
    ptsForBest: number;
    ptsForResp: number;
    ptsForTask: number;
  };
  responses: number;
  subject_id: number;
  tickets: number;
  user_id: number;
  user: UserDataInModerationTicket;
  report?: ReportInModerationTicketDataType;
  comments: Comment[];
}

export interface Response {
  attachments: Attachment[];
  best: boolean;
  content: string;
  created: string;
  id: number;
  mark: number;
  points: number;
  thanks: number;
  user: UserDataInModerationTicket;
  user_id: number;
  report?: ReportInModerationTicketDataType;
  comments: Comment[];
  wrong_report?: {
    reason: string;
    reported: string;
    user: UserDataInModerationTicket;
  };
  edited?: string;
  original_content?: string;
  task_id: number;
}

export type ModerationTicketDataType = {
  ticket: {
    id: number;
    time_left: number;
    user_id: number;
  };
  delete_reasons: {
    comment: DeletionReasonsDataType;
    task: DeletionReasonsDataType;
    response: DeletionReasonsDataType;
  };
  task: Task;
  responses: Response[];
};