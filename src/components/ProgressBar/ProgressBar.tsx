import styled from 'styled-components';

interface ProgressBarProps {
  progress: number;
}

const ProgressBarContainer = styled.div`
  position: fixed;
  top: var(--header-height, 4rem);
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--color-gray-medium);
  z-index: 200;
`;

const ProgressBarFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${(props) => props.$progress}%;
  background: linear-gradient(90deg, #4f46e5, #818cf8);
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0 2px 2px 0;
`;

export default function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <ProgressBarContainer>
      <ProgressBarFill $progress={progress} />
    </ProgressBarContainer>
  );
}
