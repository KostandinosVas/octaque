import { useEffect } from 'react';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import styled from 'styled-components';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  progress?: number;
}

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: var(--header-height, 4rem);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  z-index: 100;
`;

const Logo = styled.span`
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-primary);
`;

export default function MainLayout({
  children,
  title = 'Cognitive Profile App',
  progress,
}: MainLayoutProps) {
  useEffect(() => {
    document.title = `${title} — CogniTest`;
  }, [title]);

  return (
    <>
      <Header>
        <Logo>CogniTest</Logo>
      </Header>
      {progress !== undefined && <ProgressBar progress={progress} />}
      <div className="container">
        <main>{children}</main>
      </div>
    </>
  );
}
