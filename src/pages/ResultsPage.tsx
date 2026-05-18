import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import MainLayout from '@/components/Layout/MainLayout';
import CognitiveRadarChart from '@/components/Results/RadarChart';
import ResultsTable from '@/components/Results/ResultsTable';
import Button from '@/components/Button/Button';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { buildScore } from '@/utils/scoring';
import { UserAnswer, Score, Question } from '@/types';

const DIM_ORDER = [
  'logical-reasoning',
  'numerical-ability',
  'verbal-intelligence',
  'spatial-intelligence',
  'memory',
  'processing-speed',
  'emotional-intelligence',
  'creativity',
];

const PageWrap = styled.div`
  animation: fadeInUp 0.4s ease both;
`;

const TitleRow = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin-bottom: 0.375rem;
`;

const PageSub = styled.p`
  font-size: 0.9375rem;
  color: var(--color-text-secondary);
`;

const OverallCard = styled.div`
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: var(--border-radius-xl);
  padding: 1.5rem;
  text-align: center;
  color: white;
  margin-bottom: 1.5rem;
`;

const OverallScore = styled.div`
  font-size: 3.5rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: 0.25rem;
`;

const OverallLabel = styled.div`
  font-size: 0.875rem;
  opacity: 0.85;
  font-weight: 500;
`;

const Section = styled.div`
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  margin-bottom: 1.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 1rem 1.5rem 0.75rem;
  border-bottom: 1px solid var(--color-border);
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
`;

export default function ResultsPage() {
  const navigate = useNavigate();
  const [answers] = useLocalStorage<UserAnswer[]>('cpa-answers', []);
  const [scores, setScores] = useState<Score[]>([]);
  const [totalAnswered, setTotalAnswered] = useState(0);

  useEffect(() => {
    const raw = localStorage.getItem('cpa-session');
    if (!raw) { navigate('/', { replace: true }); return; }
    const session = JSON.parse(raw) as Question[];
    setTotalAnswered(session.length);

    const computed = DIM_ORDER.map(dimId => {
      const dimQuestions = session.filter(q => q.dimension === dimId);
      const dimName = dimQuestions[0]?.dimensionName ?? dimId;
      return buildScore(dimName, dimQuestions, answers);
    }).filter(s => s.rawScore >= 0);

    setScores(computed);
  }, [answers, navigate]);

  const overall = scores.length > 0
    ? Math.round(scores.reduce((a, s) => a + s.normalizedScore, 0) / scores.length)
    : 0;

  const handleRetake = () => {
    localStorage.removeItem('cpa-answers');
    localStorage.removeItem('cpa-session');
    navigate('/');
  };

  return (
    <MainLayout title="Your Results" progress={100}>
      <PageWrap>
        <TitleRow>
          <PageTitle>Your Cognitive Profile</PageTitle>
          <PageSub>{totalAnswered} questions completed across 8 dimensions</PageSub>
        </TitleRow>

        <OverallCard>
          <OverallScore>{overall}</OverallScore>
          <OverallLabel>Overall Score (0–100)</OverallLabel>
        </OverallCard>

        {scores.length > 0 && (
          <>
            <Section>
              <SectionTitle>Radar Chart</SectionTitle>
              <CognitiveRadarChart scores={scores} />
            </Section>

            <Section>
              <SectionTitle>Breakdown by Dimension</SectionTitle>
              <ResultsTable scores={scores} />
            </Section>
          </>
        )}

        <ButtonRow>
          <Button onClick={handleRetake}>Retake Test</Button>
          <Button variant="secondary" onClick={() => navigate('/')}>Home</Button>
        </ButtonRow>
      </PageWrap>
    </MainLayout>
  );
}
