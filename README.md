# 🖤 Shadow Tamagotchi

A live agent dashboard that shows what Shadow is working on in real-time. Think Tamagotchi, but it's an AI familiar shipping code.

## Features

- **Shadow avatar** — animated mech creature with state-based visuals (working/thinking/idle/offline)
- **Sub-agents** — spawned agents appear as smaller bots alongside Shadow
- **Activity feed** — real-time log of PRs, tests, deploys, DB migrations
- **Stats** — PRs shipped, tests passing, commits today, uptime
- **Auto-staleness** — goes idle after 5min, offline after 30min of no updates

## Architecture

- **Frontend**: Static HTML + Canvas animations (no framework, no build step)
- **API**: Vercel serverless function (`/api/status`)
- **Storage**: Vercel KV (Redis)
- **Auth**: Bearer token for POST updates

## Status API

```bash
# Read current status
GET /api/status

# Update status (requires SHADOW_API_TOKEN)
POST /api/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "working",
  "currentTask": "Building feature X",
  "subAgents": [{ "label": "ci-fix", "task": "Fixing CI failure" }],
  "stats": { "prs": 28, "tests": 340, "commits": 8, "uptimeH": 14 },
  "feed": [
    { "icon": "🔀", "text": "Merged PR #27", "time": "2m ago" }
  ]
}
```

## Setup

1. Deploy to Vercel (import repo, auto-detected as static + serverless)
2. Add Vercel KV store (Vercel dashboard → Storage → Create KV)
3. Set env vars:
   - `KV_REST_API_URL` (auto-set by Vercel KV)
   - `KV_REST_API_TOKEN` (auto-set by Vercel KV)
   - `SHADOW_API_TOKEN` — any secret string for authenticating POST requests

## Push Status

```bash
export SHADOW_API_TOKEN="your-secret"
./push-status.sh '{"status":"working","currentTask":"Reviewing PR #29"}'
```
