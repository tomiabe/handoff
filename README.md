# Handoff

**A human-in-the-loop supervisory console for autonomous pentest / red-team agents.**

![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)

**Live demo: [tomiabe.github.io/handoff](https://tomiabe.github.io/handoff/)**

## What this is

Autonomous security-testing agents can now do recon on their own, and some will try to confirm a vulnerability by actually running the exploit — `sqlmap` against a login form, a role-modification API call, a database dump. Nobody signs off on an LLM doing that against a real target completely unsupervised.

Handoff is the console an operator watches while that agent works. It gives them:

- **A live feed** of what the agent is doing and why, step by step — not a raw log, a narrated stream a human can actually follow
- **A findings list** — vulnerabilities the agent has surfaced so far, with severity and confidence
- **A hard stop before anything risky** — when the agent wants to do something irreversible, everything pauses and the operator sees the exact command and the agent's stated reasoning before deciding

At that stop, the operator has three options, each bound to a keyboard shortcut: **Approve** (A), **Deny** (D), or **Edit the command's parameters and approve** (E). Every decision is timestamped and recorded to a decision log — the audit trail for the engagement.

## What's real vs. simulated

This is a **portfolio project**, built to demonstrate the interaction design and full-stack scaffolding of a tool like this — not a production security product. Concretely:

- The UI, the approval-gate flow, the type schema for events (`Step`, `Finding`, `GatedAction`, `Decision`) — all real and fully interactive.
- The data behind it is synthetic. There's a real [WebSocket server](server/) that streams events over an actual socket connection, but it replays a scripted sequence — no real agent, no real target, nothing persists between sessions.
- No auth, no database, no multi-run support yet. Bring your own agent (anything that can emit the event shapes in [`src/lib/types.ts`](src/lib/types.ts)) and you'd still need to build the backend behind this console.

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without any extra configuration, the live feed runs on a built-in simulated event stream.

### With the real WebSocket server

The `server/` directory contains a small Node + `ws` server that streams the same agent events over a real WebSocket connection instead of the client-side simulation.

```bash
cd server && npm install && npm start
```

Then, in the project root, point the frontend at it:

```bash
cp .env.example .env.local
npm run dev
```

If the WebSocket server isn't running or unreachable, the frontend automatically falls back to the simulated feed — the demo never appears broken either way.

### With Docker

```bash
docker compose up --build
```

This builds and runs both the static frontend (served via nginx on `:3000`) and the WebSocket server (`:8080`) together.

## Deployment

- **Frontend** — deployed to GitHub Pages via `.github/workflows/deploy.yml` on every push to `main`. It builds a static export (`output: 'export'`) with `basePath: /handoff`.
- **WebSocket server** — not hosted by GitHub Pages (static hosting can't run a persistent process). Deploy `server/` separately to something like Render or Fly.io, then set a `NEXT_PUBLIC_WS_URL` repository variable (Settings → Secrets and variables → Actions → Variables) pointing at it, e.g. `wss://your-app.onrender.com`. The next deploy will pick it up. Leaving it unset is fine — the site runs on the simulated feed instead.
