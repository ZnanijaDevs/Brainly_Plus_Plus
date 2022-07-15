export const gradeById = (id: number) => System.grades[id.toString()];

export const subjectById = (id: number) =>
  System.subjects.find(subject => subject.id === id);

export const getShortenedReason = (fullText: string) => {
  for (let reason of System.deletionReasons) {
    if (!fullText.includes(reason.matchText)) continue;

    return reason;
  }
};