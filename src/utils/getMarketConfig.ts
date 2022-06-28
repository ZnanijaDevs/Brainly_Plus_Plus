type MarketConfig = {
  subjects: typeof SUBJECTS;
  grades: typeof GRADES;
};

export default (): MarketConfig => {
  return {
    subjects: SUBJECTS,
    grades: GRADES
  };
};

export const gradeById = (id: number): string => GRADES[id.toString()];
export const subjectById = (id: number): { 
  name: string; icon: string; 
} => SUBJECTS[id.toString()];