# Octaque — Cognitive Profile App

A timed, multi-dimensional psychometric web app that profiles a user's cognitive strengths across 8 dimensions and returns a detailed performance breakdown.

---

## Features

- **90-question adaptive sessions** — questions are randomly sampled from the full bank via Fisher-Yates shuffle
- **8 cognitive dimensions** — Logical Reasoning, Numerical Ability, Verbal Intelligence, Spatial Intelligence, Memory, Processing Speed, Emotional Intelligence, Creativity
- **Per-question timers** — questions with a `timeLimit` auto-advance on expiry
- **Memorize phase** — memory questions show a forced 5-second read card before the question appears
- **Results dashboard** — overall score (0–100), radar chart, and per-dimension breakdown table
- **Session persistence** — answers and session state are saved to `localStorage`

---

## Tech Stack

| Layer      | Technology                         |
| ---------- | ---------------------------------- |
| UI         | React 19 + TypeScript              |
| Routing    | React Router DOM v7                |
| Styling    | Styled-Components v6 + CSS Modules |
| Charts     | Recharts v3                        |
| Icons      | FontAwesome v7                     |
| Build      | Vite v6                            |
| Deployment | Cloudflare Workers (Wrangler)      |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm

### Install

```bash
npm install
```

### Dev server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## Project Structure

```
src/
├── components/        # Reusable UI components (Button, Card, Timer, etc.)
├── data/              # Question bank JSON files
├── hooks/             # Custom hooks (useTimer, useLocalStorage)
├── pages/             # Route-level pages (Home, Test, Results)
├── styles/            # Global CSS and design tokens
├── types/             # TypeScript type definitions
└── utils/             # Scoring and normalization logic
```

---

## Question Types

| Type                     | Description                        |
| ------------------------ | ---------------------------------- |
| `text-multiple-choice`   | Text-based multiple choice         |
| `visual-multiple-choice` | Image/symbol-based multiple choice |
| `open-ended`             | Free-text answer                   |
| `visual-open-ended`      | Image prompt with free-text answer |
| `drawing`                | Drawing-based response             |

---

## Scoring

1. **Raw score** — correct answers per dimension
2. **Normalized score** — `(rawScore / maxScore) × 100`, rounded to 0–100
3. **Overall score** — arithmetic mean across all 8 dimensions

### Score bands

| Score | Interpretation    |
| ----- | ----------------- |
| ≥ 90  | Exceptional       |
| ≥ 75  | Above Average     |
| ≥ 50  | Average           |
| ≥ 25  | Below Average     |
| < 25  | Needs Improvement |

---

## Deployment

The app is deployed as a static SPA on **Cloudflare Workers**.

```bash
npm run build
npx wrangler deploy
```

Configuration is in [`wrangler.jsonc`](wrangler.jsonc). All unmatched routes are rewritten to `index.html` to support client-side routing.
