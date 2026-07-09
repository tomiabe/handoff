# Handoff

An agent supervisory console — a UI for reviewing what an AI agent is doing in real time and gating its high-risk actions behind human approval.

Live demo: https://tomiabe.github.io/handoff/

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
