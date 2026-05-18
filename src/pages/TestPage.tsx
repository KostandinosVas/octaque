import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import MainLayout from '@/components/Layout/MainLayout';
import TextQuestion from '@/components/Question/TextQuestion';
import Timer from '@/components/Timer/Timer';
import { useTimer } from '@/hooks/useTimer';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Question, UserAnswer } from '@/types';

const MetaBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const DimBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
`;

const CounterText = styled.span`
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  font-weight: 500;
`;

const MEMORIZE_SECONDS = 5;

const fadeIn = keyframes`from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}`;

const MemCard = styled.div`
  background: #fff;
  border-radius: 1.25rem;
  padding: 2.5rem 2rem;
  border: 1px solid rgba(107,56,212,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  animation: ${fadeIn} 0.3s ease both;
`;

const MemLabel = styled.p`
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b38d4;
`;

const MemSequence = styled.div`
  font-family: 'Anybody', 'Rubik', sans-serif;
  font-size: clamp(1.25rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: 0.06em;
  color: #0f172a;
  text-align: center;
  line-height: 1.4;
  word-break: break-word;
`;

const MemCountBar = styled.div`
  width: 100%;
  height: 6px;
  background: #e2e8f0;
  border-radius: 9999px;
  overflow: hidden;
`;

const MemCountFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${p => p.$pct}%;
  background: linear-gradient(90deg, #6b38d4, #4f46e5);
  border-radius: 9999px;
  transition: width 0.95s linear;
`;

const MemCountText = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const MemReadyBtn = styled.button`
  padding: 0.625rem 1.75rem;
  background: linear-gradient(135deg,#6b38d4,#4f46e5);
  color: white;
  border: none;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: transform 0.15s;
  &:hover { transform: translateY(-1px); }
`;

export default function TestPage() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Question[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useLocalStorage<UserAnswer[]>('cpa-answers', []);

  const [memorizePhase, setMemorizePhase] = useState(false);
  const [memorizeCountdown, setMemorizeCountdown] = useState(MEMORIZE_SECONDS);

  useEffect(() => {
    const raw = localStorage.getItem('cpa-session');
    if (!raw) {
      navigate('/', { replace: true });
      return;
    }
    setSession(JSON.parse(raw) as Question[]);
  }, [navigate]);

  const currentQuestion = session?.[currentIndex] ?? null;
  const timeLimit = currentQuestion?.timeLimit ?? 0;
  const total = session?.length ?? 0;
  const remaining = total - currentIndex - 1;
  const progress = total > 0 ? Math.round((currentIndex / total) * 100) : 0;

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < (session?.length ?? 0)) {
      setCurrentIndex(nextIndex);
    } else {
      navigate('/results');
    }
  }, [currentIndex, session, navigate]);

  const { timeLeft, start, pause, reset } = useTimer(timeLimit, handleNext);

  useEffect(() => {
    if (!session || !currentQuestion) return;
    if (currentQuestion.memorize) {
      setMemorizePhase(true);
      setMemorizeCountdown(MEMORIZE_SECONDS);
      pause();
    } else {
      setMemorizePhase(false);
      if (timeLimit > 0) {
        reset(timeLimit);
        start();
      } else {
        pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, session]);

  useEffect(() => {
    if (!memorizePhase) return;
    if (memorizeCountdown <= 0) {
      setMemorizePhase(false);
      if (timeLimit > 0) {
        reset(timeLimit);
        start();
      }
      return;
    }
    const t = setTimeout(() => setMemorizeCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [memorizePhase, memorizeCountdown]);

  const handleAnswer = (answerId: string) => {
    if (!currentQuestion) return;
    const timeTaken = timeLimit > 0 ? (timeLimit - timeLeft) * 1000 : 0;
    setAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer: answerId, timeTaken },
    ]);
    setTimeout(handleNext, 600);
  };

  if (!session || !currentQuestion) {
    return <MainLayout title="Loading…"><p>Loading…</p></MainLayout>;
  }

  if (memorizePhase && currentQuestion.memorize) {
    const pct = (memorizeCountdown / MEMORIZE_SECONDS) * 100;
    return (
      <MainLayout title={currentQuestion.dimensionName} progress={progress}>
        <MetaBar>
          <DimBadge>{currentQuestion.dimensionName}</DimBadge>
          <CounterText>{currentIndex + 1} / {total} &nbsp;·&nbsp; {remaining} left</CounterText>
        </MetaBar>
        <MemCard>
          <MemLabel>Memorize this sequence</MemLabel>
          <MemSequence>{currentQuestion.memorize}</MemSequence>
          <MemCountBar>
            <MemCountFill $pct={pct} />
          </MemCountBar>
          <MemCountText>Disappears in {memorizeCountdown}s</MemCountText>
          <MemReadyBtn onClick={() => setMemorizeCountdown(0)}>I'm Ready</MemReadyBtn>
        </MemCard>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={currentQuestion.dimensionName} progress={progress}>
      {timeLimit > 0 && <Timer timeLeft={timeLeft} totalTime={timeLimit} />}
      <MetaBar>
        <DimBadge>{currentQuestion.dimensionName}</DimBadge>
        <CounterText>
          {currentIndex + 1} / {total} &nbsp;·&nbsp; {remaining} left
        </CounterText>
      </MetaBar>
      <TextQuestion
        key={currentQuestion.id}
        question={currentQuestion}
        onAnswer={handleAnswer}
      />
    </MainLayout>
  );
}
