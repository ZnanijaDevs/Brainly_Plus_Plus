type MarketConfig = {
  subjects: typeof MARKET.subjects;
  grades: typeof MARKET.grades;
};

export default (): MarketConfig => {
  return {
    subjects: MARKET.subjects,
    grades: MARKET.grades
  };
};

export const gradeById = (id: number): string => MARKET.grades[id.toString()];
export const subjectById = (id: number): { 
  name: string; icon: string; 
} => MARKET.subjects[id.toString()];