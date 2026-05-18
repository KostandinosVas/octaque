import { useState, useEffect } from 'react';

export function useTimer(initialTime: number, onTimeout?: () => void) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            onTimeout?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onTimeout]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsActive(false);
  };

  return { timeLeft, start, pause, reset, isActive };
}
