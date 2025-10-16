export interface Language {
  id: string;
  name: string;
  flag: string;
  color: string;
  description: string;
  culturalFact: string;
  students: number;
}

export interface UserGoal {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface ProgressStage {
  stage: number;
  title: string;
  description: string;
  duration: string;
  skills: string[];
}