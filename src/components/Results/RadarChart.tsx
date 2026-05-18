import styled from 'styled-components';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { Score } from '@/types';

interface CognitiveRadarChartProps {
  scores: Score[];
}

const ChartContainer = styled.div`
  width: 100%;
  height: 380px;
  padding: 1rem 0.5rem;
`;

export default function CognitiveRadarChart({ scores }: CognitiveRadarChartProps) {
  const data = scores.map((s) => ({
    subject: s.dimension,
    score: s.normalizedScore,
    fullMark: 100,
  }));

  return (
    <ChartContainer>
      <ResponsiveContainer>
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            tickCount={4}
          />
          <Radar
            name="Your Score"
            dataKey="score"
            stroke="#4f46e5"
            fill="#4f46e5"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Tooltip
            contentStyle={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '0.625rem',
              fontSize: '0.875rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.07)',
            }}
            formatter={(value) => [`${value ?? 0} / 100`, 'Score']}
          />
        </RadarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
