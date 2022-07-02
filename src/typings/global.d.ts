declare global {
  const EXTENSION_VERSION: string;
  const MESSAGES: typeof import("../configs/messages.json");
  const SUBJECTS: typeof import("../configs/subjects.json");
  const GRADES: typeof import("../configs/grades.json");
  const RANKS: typeof import("../configs/ranks.json");
}

export {};