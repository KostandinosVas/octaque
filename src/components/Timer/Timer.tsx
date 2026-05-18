import styled, { keyframes, css } from 'styled-components';

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function ringColor(pct: number) {
  if (pct > 0.5) return '#10b981';
  if (pct > 0.25) return '#f59e0b';
  return '#ef4444';
}

const pulse = keyframes`
  0%, 100% { transform: translateX(-50%) scale(1); }
  50%       { transform: translateX(-50%) scale(1.07); }
`;
const shake = keyframes`
  0%, 100% { transform: translateX(-50%) rotate(0deg); }
  20%       { transform: translateX(calc(-50% - 5px)) rotate(-2deg); }
  40%       { transform: translateX(calc(-50% + 5px)) rotate(2deg); }
  60%       { transform: translateX(calc(-50% - 4px)) rotate(-1deg); }
  80%       { transform: translateX(calc(-50% + 4px)) rotate(1deg); }
`;
const radialGlow = keyframes`
  0%, 100% { box-shadow: none; }
  50%       { box-shadow: none; }
`;
const numberPop = keyframes`
  0%   { transform: scale(1.4); opacity: 0.5; }
  100% { transform: scale(1);   opacity: 1; }
`;

const Wrapper = styled.div<{ $warn: boolean; $crit: boolean }>`
  position: fixed;
  bottom: 15rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 300;

  ${p =>
    p.$crit
      ? css`animation: ${shake} 0.45s ease-in-out infinite;`
      : p.$warn
      ? css`animation: ${pulse} 0.9s ease-in-out infinite;`
      : ''}
`;

const Ring = styled.div<{ $warn: boolean; $crit: boolean }>`
  position: relative;
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);

  ${p =>
    p.$crit &&
    css`animation: ${radialGlow} 0.65s ease-in-out infinite;`}
`;

const TimeLabel = styled.div<{ $color: string; $crit: boolean }>`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1px;
  pointer-events: none;
`;

const Seconds = styled.span<{ $color: string; $crit: boolean; $key: number }>`
  font-family: 'Anybody', 'Inter', sans-serif;
  font-weight: 800;
  font-size: ${p => (p.$crit ? '2rem' : '1.625rem')};
  line-height: 1;
  color: ${p => p.$color};
  letter-spacing: -0.04em;
  transition: color 0.3s;
  animation: ${numberPop} 0.25s ease both;
`;

const Unit = styled.span<{ $color: string }>`
  font-size: 0.5625rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${p => p.$color};
  opacity: 0.65;
`;

export default function Timer({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) {
  const pct = totalTime > 0 ? Math.max(0, timeLeft / totalTime) : 0;
  const warn = pct < 0.3;
  const crit = pct < 0.15 || timeLeft <= 5;
  const color = ringColor(pct);

  const offset = CIRCUMFERENCE * (1 - pct);
  const displayTime =
    timeLeft >= 60
      ? `${Math.floor(timeLeft / 60)}:${String(timeLeft % 60).padStart(2, '0')}`
      : `${timeLeft}`;

  return (
    <Wrapper $warn={warn} $crit={crit}>
      <Ring $warn={warn} $crit={crit}>
        <svg
          width="108"
          height="108"
          style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}
        >
          <circle cx="54" cy="54" r={RADIUS} fill="none" stroke="#e7e8ea" strokeWidth="8" />
          <circle
            cx="54"
            cy="54"
            r={RADIUS}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.35s ease' }}
          />
        </svg>
        <TimeLabel $color={color} $crit={crit}>
          <Seconds $color={color} $crit={crit} $key={timeLeft}>
            {displayTime}
          </Seconds>
          <Unit $color={color}>{timeLeft >= 60 ? 'min' : 'sec'}</Unit>
        </TimeLabel>
      </Ring>
    </Wrapper>
  );
}
