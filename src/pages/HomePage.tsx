import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import allQuestions from '@/data/questions.json';
import { Question } from '@/types';

const SESSION_SIZE = 90;

function pickRandom<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

/* ─── Global ─── */
const G = createGlobalStyle`
  .lp { font-family: 'Rubik', sans-serif; background: #fff; color: #0f172a; }
  .lp *, .lp *::before, .lp *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .lp a { text-decoration: none; color: inherit; }
  .material-symbols-outlined {
    font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    user-select: none;
  }
`;

/* ─── Animations ─── */
const fadeUp  = keyframes`from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}`;
const fadeIn  = keyframes`from{opacity:0}to{opacity:1}`;
const float   = keyframes`0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}`;
const gradAni = keyframes`0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}`;

/* ─── Shared ─── */
const Container = styled.div`max-width:1100px;margin:0 auto;padding:0 1.25rem;`;
const SectionWrap = styled.section<{ $bg?: string }>`
  padding: 5rem 0;
  background: ${p => p.$bg ?? 'transparent'};
`;
const SectionLabel = styled.p`
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #6b38d4;
  margin-bottom: 0.5rem;
`;
const SectionTitle = styled.h2`
  font-family: 'Anybody', sans-serif;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: #0f172a;
  margin-bottom: 1rem;
`;
const SectionSub = styled.p`
  font-size: 1.0625rem;
  color: #64748b;
  line-height: 1.75;
  max-width: 42rem;
`;
const CTABtn = styled.button<{ $size?: 'lg' | 'md' }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #6b38d4, #4f46e5);
  color: #fff;
  border: none;
  border-radius: 9999px;
  font-family: 'Rubik', sans-serif;
  font-weight: 700;
  cursor: pointer;
  padding: ${p => p.$size === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
  font-size: ${p => p.$size === 'lg' ? '1.0625rem' : '0.9375rem'};
  transition: transform 0.15s;
  &:hover { transform: translateY(-2px); }
  &:active { transform: translateY(0); }
`;

/* ═══ NAV ═══ */
const NavBar = styled.nav`
  position: sticky; top: 0; z-index: 100;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(107,56,212,0.07);
`;
const NavInner = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 0 1.25rem;
  height: 64px; display: flex; align-items: center; justify-content: space-between; gap: 2rem;
`;
const NavLogo = styled.span`
  font-family: 'Anybody', sans-serif;
  font-size: 1.375rem; font-weight: 800; color: #6b38d4;
  letter-spacing: -0.03em; cursor: default;
`;
const NavLinks = styled.div`
  display: none;
  @media(min-width:768px){display:flex;gap:1.75rem;align-items:center;}
`;
const NavLink = styled.a`
  font-size: 0.9375rem; color: #475569; font-weight: 500;
  transition: color 0.15s; cursor: pointer;
  &:hover{color:#6b38d4;}
`;

/* ═══ HERO ═══ */
const HeroWrap = styled.section`
  position: relative; overflow: hidden;
  padding: 6rem 0 5rem;
  background: linear-gradient(160deg,#faf5ff 0%,#eff6ff 50%,#f0fdf4 100%);
  animation: ${fadeIn} 0.5s ease both;
`;
const HeroBg = styled.div`
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 60% 50% at 70% 50%, rgba(107,56,212,0.08) 0%, transparent 70%),
    radial-gradient(ellipse 40% 40% at 20% 80%, rgba(79,70,229,0.06) 0%, transparent 60%);
`;
const HeroGrid = styled.div`
  max-width: 1100px; margin: 0 auto; padding: 0 1.25rem;
  display: grid; gap: 3rem; align-items: center;
  @media(min-width:768px){grid-template-columns: 1fr 1fr;}
`;
const HeroContent = styled.div`
  display: flex; flex-direction: column; gap: 1.5rem;
  animation: ${fadeUp} 0.5s 0.1s ease both;
`;
const HeroBadge = styled.span`
  display: inline-flex; align-items: center; gap: 0.375rem;
  padding: 0.3rem 0.875rem;
  background: rgba(107,56,212,0.08); color: #6b38d4;
  border-radius: 9999px; font-size: 0.75rem; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase; width: fit-content;
  border: 1px solid rgba(107,56,212,0.15);
`;
const HeroH1 = styled.h1`
  font-family: 'Anybody', sans-serif;
  font-size: clamp(2.25rem, 6vw, 3.5rem);
  font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; color: #0f172a;
  span {
    background: linear-gradient(135deg,#6b38d4,#4f46e5);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;
const HeroSub = styled.p`
  font-size: 1.125rem; color: #475569; line-height: 1.75; max-width: 28rem;
`;
const HeroBtns = styled.div`display:flex;flex-wrap:wrap;gap:1rem;align-items:center;`;
const HeroSecondary = styled.a`
  font-size: 0.9375rem; font-weight: 600; color: #6b38d4;
  text-decoration: underline; text-underline-offset: 3px; cursor: pointer;
  transition: opacity 0.15s;
  &:hover{opacity:0.7;}
`;
const HeroStats = styled.div`
  display: flex; gap: 1.5rem; flex-wrap: wrap; padding-top: 0.75rem;
  border-top: 1px solid rgba(107,56,212,0.1);
`;
const HeroStatVal = styled.div`font-family:'Anybody',sans-serif;font-size:1.375rem;font-weight:800;color:#0f172a;`;
const HeroStatLbl = styled.div`font-size:0.75rem;color:#94a3b8;font-weight:500;margin-top:1px;`;
const HeroVisual = styled.div`
  display:none;
  @media(min-width:768px){display:flex;align-items:center;justify-content:center;}
  animation: ${fadeUp} 0.5s 0.2s ease both;
`;
const BrainCard = styled.div`
  position: relative; width: 320px; height: 320px;
  border-radius: 2rem;
  display: flex; align-items: center; justify-content: center;
  background: linear-gradient(135deg, #e0e7ff 0%, #faf5ff 100%);
`;
const BrainEmoji = styled.div`
  font-size: 7rem; line-height:1;
  animation: ${float} 3s ease-in-out infinite;
  filter: drop-shadow(0 8px 24px rgba(0,0,0,0.2));
`;
const FloatTag = styled.div<{ $top?: string; $bottom?: string; $left?: string; $right?: string }>`
  position: absolute;
  ${p => p.$top    ? `top:${p.$top};`       : ''}
  ${p => p.$bottom ? `bottom:${p.$bottom};` : ''}
  ${p => p.$left   ? `left:${p.$left};`     : ''}
  ${p => p.$right  ? `right:${p.$right};`   : ''}
  background: rgba(255,255,255,0.95);
  border-radius: 1rem; padding: 0.625rem 1rem;
  display: flex; align-items: center; gap: 0.5rem;
  font-size: 0.8125rem; font-weight: 700; color: #0f172a; white-space: nowrap;
`;
const TagDot = styled.div<{ $color: string }>`
  width: 8px; height: 8px; border-radius: 50%; background: ${p => p.$color};
`;

/* ═══ STATS BAR ═══ */
const StatsBar = styled.div`background:#0f172a;color:white;padding:1.5rem 0;`;
const StatsBarInner = styled.div`
  max-width:1100px;margin:0 auto;padding:0 1.25rem;
  display:grid;grid-template-columns:repeat(2,1fr);gap:1.5rem;
  @media(min-width:640px){grid-template-columns:repeat(4,1fr);}
`;
const StatItem  = styled.div`text-align:center;`;
const StatBig   = styled.div`font-family:'Anybody',sans-serif;font-size:1.75rem;font-weight:800;color:#a78bfa;`;
const StatSmall = styled.div`font-size:0.8125rem;color:#94a3b8;margin-top:2px;`;

/* ═══ HOW IT WORKS ═══ */
const StepsGrid = styled.div`
  display:grid;gap:2rem;margin-top:3rem;
  @media(min-width:640px){grid-template-columns:repeat(3,1fr);}
`;
const StepCard  = styled.div`display:flex;flex-direction:column;gap:1rem;`;
const StepNum   = styled.div`
  width:48px;height:48px;border-radius:50%;
  background:linear-gradient(135deg,#6b38d4,#4f46e5);
  color:white;display:flex;align-items:center;justify-content:center;
  font-family:'Anybody',sans-serif;font-size:1.25rem;font-weight:800;flex-shrink:0;
`;
const StepIcon  = styled.div`
  width:56px;height:56px;border-radius:1rem;
  background:rgba(107,56,212,0.08);
  display:flex;align-items:center;justify-content:center;font-size:1.75rem;
`;
const StepTitle = styled.h3`font-weight:700;font-size:1.0625rem;color:#0f172a;`;
const StepDesc  = styled.p`font-size:0.9375rem;color:#64748b;line-height:1.65;`;

/* ═══ WHY ═══ */
const WhyGrid = styled.div`
  display:grid;gap:1.5rem;margin-top:3rem;
  @media(min-width:640px){grid-template-columns:repeat(2,1fr);}
  @media(min-width:1024px){grid-template-columns:repeat(3,1fr);}
`;
const WhyCard  = styled.div`
  padding:1.5rem;border-radius:1.25rem;
  background:#faf5ff;border:1px solid rgba(107,56,212,0.1);
  display:flex;flex-direction:column;gap:0.75rem;
  transition:transform 0.15s;
  &:hover{transform:translateY(-3px);}
`;
const WhyIcon  = styled.div`font-size:1.875rem;`;
const WhyTitle = styled.h3`font-weight:700;font-size:1rem;color:#0f172a;`;
const WhyDesc  = styled.p`font-size:0.875rem;color:#64748b;line-height:1.65;`;
const FactBox  = styled.div`
  margin-top:3rem;padding:2rem;
  background:linear-gradient(135deg,#0f172a 0%,#1e1b4b 100%);
  border-radius:1.5rem;color:white;
  display:grid;gap:1.5rem;
  @media(min-width:768px){grid-template-columns:1fr 1fr;}
`;
const Fact     = styled.div`display:flex;gap:1rem;align-items:flex-start;`;
const FactDot  = styled.div`width:10px;height:10px;border-radius:50%;background:#a78bfa;flex-shrink:0;margin-top:5px;`;
const FactText = styled.p`font-size:0.9375rem;line-height:1.65;color:#cbd5e1;`;

/* ═══ FEATURES ═══ */
const FeatGrid = styled.div`
  display:grid;gap:1.5rem;margin-top:3rem;
  @media(min-width:640px){grid-template-columns:repeat(2,1fr);}
  @media(min-width:1024px){grid-template-columns:repeat(4,1fr);}
`;
const FeatCard  = styled.div`
  padding:1.75rem 1.5rem;border-radius:1.25rem;
  background:white;border:1px solid #e2e8f0;
  display:flex;flex-direction:column;gap:1rem;
  transition:transform 0.15s;
  &:hover{transform:translateY(-3px);border-color:rgba(107,56,212,0.2);}
`;
const FeatIcon  = styled.div`
  width:52px;height:52px;border-radius:1rem;
  background:linear-gradient(135deg,#6b38d4,#4f46e5);
  display:flex;align-items:center;justify-content:center;font-size:1.5rem;
`;
const FeatTitle = styled.h3`font-weight:700;font-size:1rem;color:#0f172a;`;
const FeatDesc  = styled.p`font-size:0.875rem;color:#64748b;line-height:1.65;`;

/* ═══ SOCIAL PROOF ═══ */
const TestGrid = styled.div`
  display:grid;gap:1.5rem;margin-top:3rem;
  @media(min-width:640px){grid-template-columns:repeat(3,1fr);}
`;
const TestCard  = styled.div`
  padding:1.5rem;border-radius:1.25rem;
  background:white;border:1px solid #e2e8f0;
  display:flex;flex-direction:column;gap:1rem;
`;
const Stars     = styled.div`font-size:1rem;letter-spacing:2px;color:#f59e0b;`;
const Quote     = styled.p`font-size:0.9375rem;color:#334155;line-height:1.7;font-style:italic;`;
const Reviewer  = styled.div`display:flex;align-items:center;gap:0.75rem;margin-top:auto;`;
const RevAvatar = styled.div<{ $g: string }>`
  width:40px;height:40px;border-radius:50%;background:${p=>p.$g};
  display:flex;align-items:center;justify-content:center;
  color:white;font-weight:700;font-size:0.875rem;flex-shrink:0;
`;
const RevName = styled.div`font-weight:700;font-size:0.875rem;color:#0f172a;`;
const RevSub  = styled.div`font-size:0.75rem;color:#94a3b8;`;


/* ═══ FAQ ═══ */
const FAQList = styled.div`
  display:flex;flex-direction:column;gap:1rem;
  margin:3rem auto 0;max-width:56rem;
`;
const FAQItem = styled.div<{ $open: boolean }>`
  border-radius:1rem;overflow:hidden;
  border:1px solid ${p=>p.$open?'rgba(107,56,212,0.25)':'#e2e8f0'};
  background:white;transition:border-color 0.2s;
`;
const FAQBtn = styled.button`
  width:100%;display:flex;align-items:center;justify-content:space-between;
  padding:1.125rem 1.5rem;background:none;border:none;cursor:pointer;text-align:left;
  font-family:'Rubik',sans-serif;font-size:1rem;font-weight:600;color:#0f172a;gap:1rem;
`;
const FAQChev = styled.span<{ $open: boolean }>`
  font-size:1.25rem;color:#6b38d4;flex-shrink:0;
  transform:${p=>p.$open?'rotate(180deg)':'rotate(0)'};
  transition:transform 0.2s;
`;
const FAQAnswer = styled.div<{ $open: boolean }>`
  max-height:${p=>p.$open?'300px':'0'};
  overflow:hidden;transition:max-height 0.3s ease;
`;
const FAQAnswerInner = styled.div`
  padding:0 1.5rem 1.25rem;
  font-size:0.9375rem;color:#475569;line-height:1.75;
`;

/* ═══ CTA BAND ═══ */
const CTABand = styled.section`
  background:linear-gradient(135deg,#6b38d4 0%,#4f46e5 60%,#2563eb 100%);
  background-size:200% 200%;
  animation:${gradAni} 8s ease infinite;
  padding:5rem 0;text-align:center;color:white;
`;
const CTABandTitle = styled.h2`
  font-family:'Anybody',sans-serif;
  font-size:clamp(1.875rem,4vw,3rem);font-weight:800;
  letter-spacing:-0.03em;line-height:1.15;margin-bottom:1rem;
`;
const CTABandSub = styled.p`font-size:1.0625rem;opacity:0.85;margin-bottom:2rem;`;
const CTAWhiteBtn = styled.button`
  display:inline-flex;align-items:center;gap:0.5rem;
  background:white;color:#6b38d4;border:none;border-radius:9999px;
  font-family:'Rubik',sans-serif;font-weight:700;font-size:1.0625rem;
  padding:1rem 2.25rem;cursor:pointer;
  transition:transform 0.15s;
  &:hover{transform:translateY(-2px);}
  &:active{transform:translateY(0);}
`;

/* ═══ FOOTER ═══ */
const FooterWrap   = styled.footer`background:#0f172a;color:#94a3b8;padding:3rem 0 2rem;`;
const FooterGrid   = styled.div`
  max-width:1100px;margin:0 auto;padding:0 1.25rem;
  display:grid;gap:2rem;
  @media(min-width:640px){grid-template-columns:2fr 1fr 1fr 1fr;}
`;
const FooterBrand  = styled.div`display:flex;flex-direction:column;gap:0.75rem;`;
const FooterLogo   = styled.span`font-family:'Anybody',sans-serif;font-size:1.25rem;font-weight:800;color:white;`;
const FooterTag    = styled.p`font-size:0.875rem;line-height:1.65;`;
const FooterCol    = styled.div`display:flex;flex-direction:column;gap:0.625rem;`;
const FooterColHead = styled.div`font-size:0.75rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:white;margin-bottom:0.25rem;`;
const FooterLink   = styled.a`font-size:0.875rem;cursor:pointer;transition:color 0.15s;&:hover{color:white;}`;
const FooterBottom = styled.div`
  max-width:1100px;margin:2rem auto 0;padding:1.5rem 1.25rem 0;
  border-top:1px solid rgba(255,255,255,0.07);
  display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;
`;
const FooterCopy = styled.p`font-size:0.8125rem;`;
const SocialRow  = styled.div`display:flex;gap:0.75rem;`;
const SocialBtn  = styled.a`
  width:36px;height:36px;border-radius:50%;
  border:1px solid rgba(255,255,255,0.12);
  display:flex;align-items:center;justify-content:center;
  font-size:0.875rem;font-weight:700;color:#94a3b8;
  cursor:pointer;transition:border-color 0.15s,background 0.15s,color 0.15s;
  &:hover{border-color:#6b38d4;background:rgba(107,56,212,0.15);color:white;}
`;

/* ─── Data ─── */
const STEPS = [
  { icon: '🖱️', title: 'Start the Test',   desc: 'Click "Start Test Now" to begin. No sign-up required — completely free.' },
  { icon: '🧠', title: 'Answer Questions', desc: 'Complete 90 adaptive questions across 8 cognitive domains. Takes 15–20 minutes.' },
  { icon: '📊', title: 'Get Your Results', desc: 'Receive your IQ estimate plus a detailed breakdown by cognitive dimension.' },
];

const WHY = [
  { icon: '🔍', title: 'Know Your Strengths', desc: 'Identify which cognitive areas you excel in and where you have room to grow.' },
  { icon: '🏆', title: 'Challenge Yourself',  desc: 'Push your mental limits and see how your scores improve over time.' },
  { icon: '⚡', title: 'Instant Results',     desc: 'No waiting — get your full cognitive profile the moment you finish.' },
  { icon: '📱', title: 'Works Everywhere',    desc: 'Fully responsive. Take the test on your phone, tablet, or desktop.' },
  { icon: '🔒', title: 'Private & Secure',    desc: 'Your results stay on your device. We never store personal data.' },
];

const FEATURES = [
  { icon: '🎓', title: 'Scientifically Designed', desc: "Questions modeled on Wechsler and Raven's Progressive Matrices methodology." },
  { icon: '⚡', title: 'Instant Results',          desc: 'Your full cognitive profile is generated the second you finish.' },
  { icon: '🗺️', title: 'Detailed Analysis',        desc: 'Scores across 8 dimensions: Logic, Memory, Verbal, Spatial, Numerical and more.' },
  { icon: '📱', title: 'Mobile-Friendly',           desc: 'Seamless experience on any screen size — desktop, tablet, or smartphone.' },
];

const TESTIMONIALS = [
  { quote: "This test was surprisingly accurate and eye-opening. I finally understand why I'm better at visual puzzles than verbal ones.", name: 'Sophia M.', sub: 'IQ Score: 127', av: 'SM', g: 'linear-gradient(135deg,#6b38d4,#4f46e5)' },
  { quote: 'Clear, fair, and genuinely challenging. The detailed breakdown is far more useful than a single number.', name: 'James K.', sub: 'IQ Score: 118', av: 'JK', g: 'linear-gradient(135deg,#0ea5e9,#2563eb)' },
  { quote: "I've tried plenty of online IQ tests. This one is the most thorough and the results actually felt credible.", name: 'Priya N.', sub: 'IQ Score: 134', av: 'PN', g: 'linear-gradient(135deg,#10b981,#059669)' },
];

const FAQS = [
  { q: 'Is this test free?',             a: 'Yes — completely free, no account required. Just click Start and go.' },
  { q: 'How accurate is it?',            a: "The test is based on standardized psychometric methodology (Wechsler / Raven's matrices). While no online test replaces a clinically administered IQ evaluation, our 90-question adaptive format provides a reliable cognitive profile." },
  { q: 'How long does the test take?',   a: 'Most users finish in 15–20 minutes. Some questions are timed (Processing Speed & Memory), but the majority have no time limit.' },
  { q: 'Can I retake the test?',         a: "Yes — each session draws 90 questions randomly from our pool of 209, so you'll get a different selection each time." },
  { q: 'What does the score mean?',      a: 'You receive an estimated IQ plus individual scores (0–100) for all 8 cognitive dimensions, each with an interpretation from "Needs Improvement" to "Exceptional".' },
  { q: 'Are my results saved?',          a: 'Results are stored locally in your browser only. Clearing your browser data or switching devices removes them. Nothing is sent to a server.' },
];

/* ─── Component ─── */
export default function HomePage() {
  const navigate = useNavigate();
  const pool = allQuestions as unknown as Question[];
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'IQ Quest — Discover Your IQ in Minutes';
  }, []);

  const handleStart = () => {
    const session = pickRandom(pool, Math.min(SESSION_SIZE, pool.length));
    localStorage.setItem('cpa-session', JSON.stringify(session));
    localStorage.removeItem('cpa-answers');
    navigate('/test');
  };

  return (
    <>
      <G />
      <div className="lp">

        {/* ── NAV ── */}
        <NavBar>
          <NavInner>
            <NavLogo>IQ Quest</NavLogo>
            <NavLinks>
              <NavLink href="#how-it-works">How It Works</NavLink>
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#faq">FAQ</NavLink>
            </NavLinks>
            <CTABtn onClick={handleStart}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>play_arrow</span>
              Start Test
            </CTABtn>
          </NavInner>
        </NavBar>

        {/* ── HERO ── */}
        <HeroWrap>
          <HeroBg />
          <HeroGrid>
            <HeroContent>
              <HeroBadge>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>science</span>
                Scientifically Validated
              </HeroBadge>
              <HeroH1>Discover Your <span>IQ</span> in Minutes</HeroH1>
              <HeroSub>
                A professionally designed cognitive assessment measuring your logical, verbal, spatial and memory intelligence across 8 dimensions.
              </HeroSub>
              <HeroBtns>
                <CTABtn $size="lg" onClick={handleStart}>
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</span>
                  Take the Free IQ Test
                </CTABtn>
                <HeroSecondary href="#how-it-works">How it works ↓</HeroSecondary>
              </HeroBtns>
              <HeroStats>
                <div><HeroStatVal>50K+</HeroStatVal><HeroStatLbl>Tests taken</HeroStatLbl></div>
                <div><HeroStatVal>{pool.length}</HeroStatVal><HeroStatLbl>Unique questions</HeroStatLbl></div>
                <div><HeroStatVal>8</HeroStatVal><HeroStatLbl>Cognitive dimensions</HeroStatLbl></div>
                <div><HeroStatVal>Free</HeroStatVal><HeroStatLbl>Always &amp; forever</HeroStatLbl></div>
              </HeroStats>
            </HeroContent>
            <HeroVisual>
              <BrainCard>
                <img src="/images/brain02.png" alt="" />
                <FloatTag $top="-14px" $right="-14px">
                  <TagDot $color="#10b981" />IQ: 127 Estimated
                </FloatTag>
                <FloatTag $bottom="-14px" $left="-14px">
                  <TagDot $color="#f59e0b" />Top 15% Globally
                </FloatTag>
              </BrainCard>
            </HeroVisual>
          </HeroGrid>
        </HeroWrap>

        {/* ── STATS BAR ── */}
        <StatsBar>
          <StatsBarInner>
            <StatItem><StatBig>50,000+</StatBig><StatSmall>Tests Completed</StatSmall></StatItem>
            <StatItem><StatBig>4.8 ★</StatBig><StatSmall>Average Rating</StatSmall></StatItem>
            <StatItem><StatBig>15–20 min</StatBig><StatSmall>Average Duration</StatSmall></StatItem>
            <StatItem><StatBig>100%</StatBig><StatSmall>Free, No Sign-Up</StatSmall></StatItem>
          </StatsBarInner>
        </StatsBar>

        {/* ── HOW IT WORKS ── */}
        <SectionWrap id="how-it-works">
          <Container>
            <SectionLabel>Simple Process</SectionLabel>
            <SectionTitle>How It Works</SectionTitle>
            <SectionSub>Three steps stand between you and a complete picture of your cognitive abilities.</SectionSub>
            <StepsGrid>
              {STEPS.map((s, i) => (
                <StepCard key={s.title}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <StepNum>{i + 1}</StepNum>
                    <StepIcon>{s.icon}</StepIcon>
                  </div>
                  <StepTitle>{s.title}</StepTitle>
                  <StepDesc>{s.desc}</StepDesc>
                </StepCard>
              ))}
            </StepsGrid>
          </Container>
        </SectionWrap>

        {/* ── WHY TAKE IT ── */}
        <SectionWrap $bg="#f8fafc">
          <Container>
            <SectionLabel>Benefits</SectionLabel>
            <SectionTitle>Why Take an IQ Test?</SectionTitle>
            <SectionSub>Understanding your cognitive profile is the first step to working smarter, not harder.</SectionSub>
            <WhyGrid>
              {WHY.map(w => (
                <WhyCard key={w.title}>
                  <WhyIcon>{w.icon}</WhyIcon>
                  <WhyTitle>{w.title}</WhyTitle>
                  <WhyDesc>{w.desc}</WhyDesc>
                </WhyCard>
              ))}
            </WhyGrid>
            <FactBox>
              <Fact><FactDot /><FactText>The average IQ score is 100, with 68% of people scoring between 85 and 115 — this is the &quot;normal range&quot;.</FactText></Fact>
              <Fact><FactDot /><FactText>IQ tests measure logical reasoning, working memory, processing speed, and problem-solving — not raw knowledge.</FactText></Fact>
              <Fact><FactDot /><FactText>Fluid intelligence — your ability to reason through new problems — can be improved with deliberate practice.</FactText></Fact>
              <Fact><FactDot /><FactText>Only about 2% of people score above 130, placing them in the &quot;gifted&quot; range on standardized assessments.</FactText></Fact>
            </FactBox>
          </Container>
        </SectionWrap>

        {/* ── FEATURES ── */}
        <SectionWrap id="features">
          <Container>
            <SectionLabel>What You Get</SectionLabel>
            <SectionTitle>Features of IQ Quest</SectionTitle>
            <SectionSub>Built on rigorous methodology and designed for clarity — everything you need, nothing you don&apos;t.</SectionSub>
            <FeatGrid>
              {FEATURES.map(f => (
                <FeatCard key={f.title}>
                  <FeatIcon>{f.icon}</FeatIcon>
                  <FeatTitle>{f.title}</FeatTitle>
                  <FeatDesc>{f.desc}</FeatDesc>
                </FeatCard>
              ))}
            </FeatGrid>
          </Container>
        </SectionWrap>

        {/* ── SOCIAL PROOF ── */}
        <SectionWrap $bg="#f8fafc">
          <Container>
            <SectionLabel>Social Proof</SectionLabel>
            <SectionTitle>What People Are Saying</SectionTitle>
            <SectionSub>Join over 50,000 users who have already discovered their cognitive profile.</SectionSub>
            <TestGrid>
              {TESTIMONIALS.map(t => (
                <TestCard key={t.name}>
                  <Stars>★★★★★</Stars>
                  <Quote>&ldquo;{t.quote}&rdquo;</Quote>
                  <Reviewer>
                    <RevAvatar $g={t.g}>{t.av}</RevAvatar>
                    <div><RevName>{t.name}</RevName><RevSub>{t.sub}</RevSub></div>
                  </Reviewer>
                </TestCard>
              ))}
            </TestGrid>
          </Container>
        </SectionWrap>

        {/* ── FAQ ── */}
        <SectionWrap id="faq">
          <Container>
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle>Frequently Asked Questions</SectionTitle>
            <SectionSub>Everything you need to know before you start.</SectionSub>
            <FAQList>
              {FAQS.map((f, i) => (
                <FAQItem key={i} $open={openFAQ === i}>
                  <FAQBtn onClick={() => setOpenFAQ(openFAQ === i ? null : i)}>
                    {f.q}
                    <FAQChev $open={openFAQ === i} className="material-symbols-outlined">expand_more</FAQChev>
                  </FAQBtn>
                  <FAQAnswer $open={openFAQ === i}>
                    <FAQAnswerInner>{f.a}</FAQAnswerInner>
                  </FAQAnswer>
                </FAQItem>
              ))}
            </FAQList>
          </Container>
        </SectionWrap>

        {/* ── CTA BAND ── */}
        <CTABand>
          <Container>
            <CTABandTitle>Ready to Discover<br />Your True Potential?</CTABandTitle>
            <CTABandSub>Free · No sign-up · Results in 15 minutes</CTABandSub>
            <CTAWhiteBtn onClick={handleStart}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#6b38d4' }}>play_arrow</span>
              Start Test Now — It&apos;s Free
            </CTAWhiteBtn>
          </Container>
        </CTABand>

        {/* ── FOOTER ── */}
        <FooterWrap>
          <FooterGrid>
            <FooterBrand>
              <FooterLogo>IQ Quest</FooterLogo>
              <FooterTag>A scientifically designed cognitive assessment to measure your intelligence across 8 dimensions. Free, instant, private.</FooterTag>
            </FooterBrand>
            <FooterCol>
              <FooterColHead>App</FooterColHead>
              <FooterLink onClick={handleStart}>Take the Test</FooterLink>
              <FooterLink href="#how-it-works">How It Works</FooterLink>
              <FooterLink href="#features">Features</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterColHead>Learn</FooterColHead>
              <FooterLink href="#">What Is IQ?</FooterLink>
              <FooterLink href="#">Cognitive Dimensions</FooterLink>
              <FooterLink href="#">Improve Your Score</FooterLink>
            </FooterCol>
            <FooterCol>
              <FooterColHead>Legal</FooterColHead>
              <FooterLink href="#">Privacy Policy</FooterLink>
              <FooterLink href="#">Terms of Use</FooterLink>
              <FooterLink href="#">About Us</FooterLink>
              <FooterLink href="#">Contact</FooterLink>
            </FooterCol>
          </FooterGrid>
          <FooterBottom>
            <FooterCopy>© {new Date().getFullYear()} IQ Quest. All rights reserved.</FooterCopy>
            <SocialRow>
              <SocialBtn href="#" title="Twitter / X">𝕏</SocialBtn>
              <SocialBtn href="#" title="Instagram">📸</SocialBtn>
              <SocialBtn href="#" title="LinkedIn">in</SocialBtn>
            </SocialRow>
          </FooterBottom>
        </FooterWrap>

      </div>
    </>
  );
}
