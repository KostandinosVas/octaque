import styles from './ResultsTable.module.css';
import { Score } from '@/types';

interface ResultsTableProps {
  scores: Score[];
}

function badgeClass(interpretation: string): string {
  switch (interpretation) {
    case 'Exceptional':      return styles.badgeExceptional;
    case 'Above Average':    return styles.badgeAboveAverage;
    case 'Average':          return styles.badgeAverage;
    case 'Below Average':    return styles.badgeBelowAverage;
    default:                 return styles.badgeNeedsImprovement;
  }
}

export default function ResultsTable({ scores }: ResultsTableProps) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Score</th>
            <th>Level</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score) => (
            <tr key={score.dimension}>
              <td className={styles.dimName}>{score.dimension}</td>
              <td>
                <div className={styles.scoreRow}>
                  <span className={styles.scoreNum}>{score.normalizedScore}</span>
                  <div className={styles.scoreBar}>
                    <div
                      className={styles.scoreBarFill}
                      style={{ width: `${score.normalizedScore}%` }}
                    />
                  </div>
                </div>
              </td>
              <td>
                <span className={`${styles.badge} ${badgeClass(score.interpretation)}`}>
                  {score.interpretation}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
