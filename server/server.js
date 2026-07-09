const http = require("node:http");
const { WebSocketServer } = require("ws");
const { QUEUED_EVENTS } = require("./events");

const PORT = process.env.PORT || 8080;
const INTERVAL_MS = Number(process.env.EVENT_INTERVAL_MS) || 3000;

let idCounter = 0;
function makeId() {
  idCounter += 1;
  return `evt-${idCounter}`;
}

const httpServer = http.createServer((req, res) => {
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("handoff-ws-server: ok");
});

const wss = new WebSocketServer({ server: httpServer });

wss.on("connection", (socket) => {
  let index = 0;

  const timer = setInterval(() => {
    if (index >= QUEUED_EVENTS.length) {
      clearInterval(timer);
      return;
    }

    const raw = QUEUED_EVENTS[index];
    index += 1;

    const entry = { ...raw, id: makeId() };
    socket.send(JSON.stringify({ kind: "feed", entry }));

    if (raw.type === "gated") {
      const action = {
        id: makeId(),
        stepId: raw.stepId || "unknown",
        action: raw.content,
        command: raw.command || "",
        rationale: "Agent reasoning requires operator approval before proceeding.",
        riskLevel: "high",
        parameters: {},
      };
      socket.send(JSON.stringify({ kind: "gated", action }));
    }
  }, INTERVAL_MS);

  socket.on("close", () => clearInterval(timer));
  socket.on("error", () => clearInterval(timer));
});

httpServer.listen(PORT, () => {
  console.log(`handoff-ws-server listening on :${PORT}`);
});
