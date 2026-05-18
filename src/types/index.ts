export type QuestionType =
  | 'visual-multiple-choice'
  | 'text-multiple-choice'
  | 'open-ended'
  | 'visual-open-ended'
  | 'drawing';

export interface QuestionOption {
  id: string;
  text?: string;
  imageUrl?: string;
  symbol?: string;
}

export interface Question {
  id: string;
  dimension: string;
  dimensionName: string;
  text?: string;
  memorize?: string;
  type?: QuestionType;
  imageUrl?: string;
  options: QuestionOption[];
  correctAnswer: string | string[];
  difficulty?: 'easy' | 'medium' | 'hard';
  timeLimit: number | null;
  explanation?: string | null;
}

export interface Dimension {
  id: string;
  name: string;
  description: string;
  weight: number;
  questions: Question[];
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[] | null;
  timeTaken?: number;
}

export interface Score {
  dimension: string;
  rawScore: number;
  normalizedScore: number;
  percentile?: number;
  interpretation: string;
}
