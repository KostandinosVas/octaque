export function normalizeScore(rawScore: number, maxScore: number): number {
  if (maxScore === 0) return 0;
  return Math.round((rawScore / maxScore) * 100);
}

export function calculateTotalScore(
  scores: Record<string, number>,
  weights: Record<string, number>
): number {
  let total = 0;
  for (const [dimension, score] of Object.entries(scores)) {
    total += score * (weights[dimension] ?? 0);
  }
  return Math.round(total);
}
