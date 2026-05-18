import { useState } from 'react';
import styles from './Question.module.css';
import { Question } from '@/types';

interface TextQuestionProps {
  question: Question;
  onAnswer: (answerId: string) => void;
}

export default function TextQuestion({ question, onAnswer }: TextQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSelect = (answerId: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(answerId);
    onAnswer(answerId);
  };

  return (
    <div className={styles.questionCard}>
      {question.text && (
        <p className={styles.questionText}>{question.text}</p>
      )}
      <div className={styles.optionsList}>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`${styles.optionButton} ${
              selectedAnswer === option.id ? styles.selected : ''
            } ${selectedAnswer !== null ? styles.answered : ''}`}
            disabled={selectedAnswer !== null}
            aria-label={`Option ${option.id}: ${option.text ?? option.symbol}`}
          >
            <span className={`${styles.optionLetter} ${
              selectedAnswer === option.id ? styles.optionLetterSelected : ''
            }`}>
              {option.id}
            </span>
            <span className={styles.optionText}>{option.text ?? option.symbol}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
