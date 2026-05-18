import { Question, UserAnswer, Score } from '@/types';
import { normalizeScore } from './normalization';

export function scoreQuestions(
  questions: Question[],
  answers: UserAnswer[]
): { rawScore: number; maxScore: number } {
  const maxScore = questions.length;
  let rawScore = 0;

  for (const question of questions) {
    const userAnswer = answers.find((a) => a.questionId === question.id);
    if (!userAnswer || userAnswer.answer === null) continue;

    const correct = Array.isArray(question.correctAnswer)
      ? question.correctAnswer
      : [question.correctAnswer];

    const given = Array.isArray(userAnswer.answer)
      ? userAnswer.answer
      : [userAnswer.answer];

    const isCorrect = correct.some((c) => given.includes(c));
    if (isCorrect) rawScore++;
  }

  return { rawScore, maxScore };
}

export function interpretScore(normalizedScore: number): string {
  if (normalizedScore >= 90) return 'Exceptional';
  if (normalizedScore >= 75) return 'Above Average';
  if (normalizedScore >= 50) return 'Average';
  if (normalizedScore >= 25) return 'Below Average';
  return 'Needs Improvement';
}

export function buildScore(
  dimension: string,
  questions: Question[],
  answers: UserAnswer[]
): Score {
  const { rawScore, maxScore } = scoreQuestions(questions, answers);
  const normalizedScore = normalizeScore(rawScore, maxScore);
  return {
    dimension,
    rawScore,
    normalizedScore,
    interpretation: interpretScore(normalizedScore),
  };
}
