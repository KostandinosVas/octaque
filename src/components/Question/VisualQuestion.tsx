import { useState } from 'react';
import styles from './Question.module.css';
import { Question } from '@/types';

interface VisualQuestionProps {
  question: Question;
  onAnswer: (answerId: string) => void;
}

export default function VisualQuestion({ question, onAnswer }: VisualQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answerId: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  return (
    <div className={styles.questionCard}>
      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt="Question visual"
          className={styles.questionImage}
          width={500}
          height={300}
        />
      )}
      {question.text && (
        <p className={styles.questionText}>{question.text}</p>
      )}
      <div className={styles.optionsGrid}>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`${styles.optionButton} ${
              selectedAnswer === option.id ? styles.selected : ''
            }`}
            disabled={selectedAnswer !== null}
            aria-label={`Option ${option.id}`}
          >
            {option.imageUrl ? (
              <img
                src={option.imageUrl}
                alt={`Option ${option.id}`}
                className={styles.optionImage}
                width={100}
                height={100}
              />
            ) : (
              option.text ?? option.symbol
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
