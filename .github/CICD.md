# TraveNest CI/CD Pipeline Documentation

## Overview

This document describes the Continuous Integration and Continuous Deployment (CI/CD) pipelines for the TraveNest vehicle rental platform.

## Pipeline Structure

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           TraveNest CI/CD                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐              │
│  │   CI Pipeline │    │  PR Pipeline │    │  CD Pipeline │              │
│  │   (ci.yml)   │    │   (pr.yml)   │    │   (cd.yml)   │              │
│  └──────────────┘    └──────────────┘    └──────────────┘              │
│         │                   │                   │                       │
│         ▼                   ▼                   ▼                       │
│  All Branches         Pull Requests        Main Branch                  │
│  (Push Events)        (To main/develop)    (After Merge)               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

## Workflows

### 1. CI Pipeline (`ci.yml`)

**Triggers:** All pushes to any branch

**Purpose:** Validate code quality and run tests on every commit to prevent regressions.

**Jobs:**
| Job | Description | Duration |
|-----|-------------|----------|
| `setup` | Install and cache dependencies | ~1 min |
| `lint` | Run ESLint on all packages | ~30s |
| `typecheck` | TypeScript type validation | ~30s |
| `test-api` | Run API tests with PostgreSQL | ~2 min |
| `build` | Build all packages | ~2 min |
| `security` | Security vulnerability audit | ~30s |
| `ci-status` | Final status gate | ~5s |

### 2. PR Pipeline (`pr.yml`)

**Triggers:** Pull requests to `main` or `develop`

**Purpose:** Comprehensive validation before merging, with detailed feedback.

**Jobs:**
| Job | Description |
|-----|-------------|
| `pr-info` | Display PR metadata |
| `test-suite` | Full test suite with coverage |
| `analyze-changes` | Detect which packages changed |
| `pr-status` | Final merge gate |

### 3. CD Pipeline (`cd.yml`)

**Triggers:** Pushes to `main` branch or manual dispatch

**Purpose:** Deploy validated code to production.

**Jobs:**
| Job | Description |
|-----|-------------|
| `validate` | Pre-deployment test suite |
| `deploy-api` | Deploy API to hosting provider |
| `deploy-web` | Deploy Web to hosting provider |
| `migrate-database` | Run Prisma migrations |
| `health-check` | Post-deployment verification |
| `notify` | Send deployment notifications |

## Required Secrets

Configure these secrets in your GitHub repository settings:

### For CI/CD

| Secret               | Description                             |
| -------------------- | --------------------------------------- |
| `DATABASE_URL`       | Production PostgreSQL connection string |
| `JWT_SECRET`         | Production JWT signing secret           |
| `JWT_REFRESH_SECRET` | Production refresh token secret         |

### For Deployment (Choose based on hosting)

#### Vercel (Web)

| Secret              | Description            |
| ------------------- | ---------------------- |
| `VERCEL_TOKEN`      | Vercel API token       |
| `VERCEL_ORG_ID`     | Vercel organization ID |
| `VERCEL_PROJECT_ID` | Vercel project ID      |

#### Railway (API)

| Secret          | Description       |
| --------------- | ----------------- |
| `RAILWAY_TOKEN` | Railway API token |

#### AWS

| Secret                  | Description    |
| ----------------------- | -------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key |

### Optional

| Secret              | Description                |
| ------------------- | -------------------------- |
| `CODECOV_TOKEN`     | Codecov integration token  |
| `SLACK_WEBHOOK_URL` | Slack notification webhook |

## Required Variables

Configure these variables in your GitHub repository settings:

| Variable     | Description               | Example                     |
| ------------ | ------------------------- | --------------------------- |
| `API_URL`    | Production API URL        | `https://api.travenest.com` |
| `WEB_URL`    | Production Web URL        | `https://travenest.com`     |
| `AWS_REGION` | AWS region (if using AWS) | `us-east-1`                 |

## Branch Protection Rules

Set up these rules in GitHub repository settings:

### For `main` branch:

- Require pull request reviews before merging
- Require status checks to pass before merging
  - Required checks: `CI Status Check`, `PR Status Check`
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Do not allow bypassing the above settings

### For `develop` branch:

- Require status checks to pass before merging
  - Required checks: `CI Status Check`

## Local Testing

Run the CI checks locally before pushing:

```bash
# Run all CI checks
pnpm ci

# Or run individually
pnpm lint          # Linting
pnpm typecheck     # TypeScript check
pnpm test          # Run tests
pnpm build         # Build all packages
```

## Deployment Environments

### Staging

- Triggered by: Push to `develop` branch (configure separately if needed)
- URL: `https://staging.travenest.com`

### Production

- Triggered by: Push to `main` branch
- URL: `https://travenest.com`

## Rollback Procedure

1. Go to GitHub Actions
2. Find the last successful deployment
3. Click "Re-run all jobs" to redeploy that version

Or use Git:

```bash
git revert HEAD
git push origin main
```

## Monitoring

After deployment, monitor:

- API health endpoint: `GET /health`
- Application logs in hosting provider dashboard
- Error tracking (if configured)

## Troubleshooting

### Tests failing in CI but passing locally

- Ensure `DATABASE_URL` points to PostgreSQL (not SQLite)
- Check that all environment variables are set in GitHub Secrets

### Build failing

- Run `pnpm db:generate` before `pnpm build`
- Check for TypeScript errors with `pnpm typecheck`

### Deployment failing

- Verify all secrets are correctly configured
- Check hosting provider status page
- Review deployment logs in GitHub Actions
