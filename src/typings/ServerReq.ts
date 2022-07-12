/* eslint-disable camelcase */
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

export type AnswerDataInUserContent = {
  content: string;
  has_attachments: boolean;
  is_approved: boolean;
  is_reported: boolean;
  task_id: number;
}

export type QuestionDataInUserContent = {
  content: string;
  has_attachments: boolean;
  id: number;
  is_reported: boolean;
}