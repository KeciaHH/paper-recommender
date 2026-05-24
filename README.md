# Paper Recommender

Private research-paper recommendation app for SNN, test-time adaptation, NeuroSimDNN, reinforcement learning, DVFS, and network early exit.

## What it does

- Password-protected web UI.
- Shows 10 daily paper recommendations.
- Lets you rate each paper and add quick feedback tags.
- Uses ratings to improve future ranking.
- Includes a GitHub Actions workflow for daily recommendation generation.

## Local setup

```bash
npm install
cp .env.example .env
npm run daily
npm run dev
```

Open `http://localhost:3000` and log in with `APP_PASSWORD`.

## GitHub private repo

Create the repo as private, then add these GitHub Actions secrets:

- `APP_PASSWORD` or `APP_PASSWORD_SHA256`
- `CRON_SECRET`
- `SEMANTIC_SCHOLAR_API_KEY` if available

The included workflow runs `npm run daily` once per day and commits updated recommendation data back to the private repository.

## Deployment

For a private personal app, use Vercel, Render, Fly.io, or a small VPS. GitHub Pages is not a good fit because this app needs real password protection and server-side writes for ratings.
