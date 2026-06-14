export interface Job {
  id: string;
  company: string;
  logo: string;
  role: string;
  location: string;
  salary: string;
  experience: string;
  noticePeriod: string;
  workMode: "Hybrid" | "In-office" | "Remote" | string;
  description: string;
  skillsRequired: string[];
  applySteps: string;
}

export interface OptimizedBullet {
  original: string;
  optimized: string;
  impactBenefit: string;
}

export interface ResumeAnalysis {
  atsScore: number;
  matchedSkills: string[];
  missingSkills: string[];
  structuralSuggestions: string[];
  optimizedBulletPoints: OptimizedBullet[];
  linkedInProfileSuggestions: string;
}

export interface InterviewQuestion {
  id: number;
  category: string;
  questionText: string;
  contextHint: string;
}

export interface GradedAnswer {
  score: number;
  keyStrengths: string[];
  weaknessesAndGaps: string[];
  suggestedBetterAnswer: string;
  followUpTrickyQuestion: string;
}

export interface SalaryBenchmark {
  metroHighLpa: number;
  metroMedianLpa: number;
  tier2MedianLpa: number;
}

export interface ProgressionMilestone {
  title: string;
  duration: string;
  skillsToAcquire: string[];
  certificationsOrFocus: string;
  expectedLpaRange: string;
}

export interface HotSector {
  name: string;
  demandRating: string;
  brief: string;
}

export interface CareerPathReport {
  salaryBenchmark: SalaryBenchmark;
  progressionMilestones: ProgressionMilestone[];
  hotSectors: HotSector[];
}
