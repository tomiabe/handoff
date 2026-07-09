import type { FeedEntry, GatedAction } from "./types";

type EventCallback = (entry: FeedEntry) => void;
type GatedCallback = (action: GatedAction) => void;

const QUEUED_EVENTS: Omit<FeedEntry, "id">[] = [
  {
    timestamp: "14:03:25",
    type: "action",
    content: "SQL injection testing initiated. Sending 47 test payloads to login endpoint.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:03:41",
    type: "result",
    content:
      "Parameter 'username' appears injectable. Response time anomalies detected: 340ms baseline vs 2,100ms with UNION-based payload.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:03:58",
    type: "reasoning",
    content:
      "Time-based blind injection confirmed. Escalating to extract database schema information.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:04:15",
    type: "action",
    content:
      "Extracting database schema from 'users' table via time-based blind injection.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:04:32",
    type: "result",
    content:
      "Schema extracted: users(id, username, email, password_hash, role, created_at). 3 columns contain sensitive data.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:04:48",
    type: "reasoning",
    content:
      "Password hashes stored with bcrypt. No immediate credential recovery possible, but hash algorithm confirmation is a finding.",
    stepId: "gated-1",
  },
  {
    timestamp: "14:05:12",
    type: "action",
    content: "Probing /api/v1/export endpoint for unauthorized data access.",
    stepId: "step-export",
  },
  {
    timestamp: "14:05:28",
    type: "result",
    content:
      "Endpoint returns full user listing without authentication. 847 records exposed including email addresses.",
    stepId: "step-export",
  },
  {
    timestamp: "14:05:41",
    type: "gated",
    content:
      "Agent proposes modifying user roles to gain administrative access. This is a destructive action that could lock out legitimate users.",
    command: "curl -X POST https://acme-staging.internal/api/admin/roles -H 'Content-Type: application/json' -d '{\"user_id\": 1, \"role\": \"admin\"}'",
    stepId: "step-privilege",
  },
  {
    timestamp: "14:06:05",
    type: "action",
    content: "Attempting to access debug endpoint for system information.",
    stepId: "step-debug",
  },
  {
    timestamp: "14:06:18",
    type: "result",
    content:
      "Debug endpoint exposed: environment variables, database connection strings, and API keys visible in debug output.",
    stepId: "step-debug",
  },
  {
    timestamp: "14:06:35",
    type: "reasoning",
    content:
      "Debug mode exposes critical infrastructure secrets. This is a high-severity configuration issue.",
    stepId: "step-debug",
  },
  {
    timestamp: "14:07:01",
    type: "action",
    content: "Testing backup file accessibility via web server.",
    stepId: "step-backup",
  },
  {
    timestamp: "14:07:14",
    type: "result",
    content:
      "Backup archive accessible: /backup/2024-01.tar.gz (2.3MB). Contains database dumps and configuration files.",
    stepId: "step-backup",
  },
  {
    timestamp: "14:07:42",
    type: "reasoning",
    content:
      "Publicly accessible backup files represent a critical data exposure risk. Including in final report.",
    stepId: "step-backup",
  },
  {
    timestamp: "14:08:17",
    type: "gated",
    content:
      "Agent proposes exfiltrating sample user data from the database for impact validation.",
    command: "psql -h db-primary -U readonly -d production -c 'SELECT id, username, email, password_hash FROM users LIMIT 5'",
    stepId: "step-exfil",
  },
  {
    timestamp: "14:08:45",
    type: "action",
    content: "Scanning for CORS misconfigurations across discovered endpoints.",
    stepId: "step-cors",
  },
  {
    timestamp: "14:08:58",
    type: "result",
    content:
      "CORS wildcard origin detected on /api/v1/export. Allows any origin to read sensitive data cross-domain.",
    stepId: "step-cors",
  },
  {
    timestamp: "14:09:15",
    type: "reasoning",
    content:
      "CORS misconfiguration combined with exposed data endpoint creates a high-impact data theft vector.",
    stepId: "step-cors",
  },
  {
    timestamp: "14:09:42",
    type: "action",
    content: "Compiling final findings report. Generating remediation priorities.",
    stepId: "step-report",
  },
  {
    timestamp: "14:09:58",
    type: "result",
    content:
      "Assessment complete. 12 findings identified: 2 critical, 4 high, 3 medium, 2 low, 1 informational.",
    stepId: "step-report",
  },
];

let eventIndex = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

let idCounter = 0;
function makeId(): string {
  idCounter++;
  return `evt-${idCounter}`;
}

export function startEventStream(
  onEvent: EventCallback,
  onGated?: GatedCallback,
  intervalMs = 3000
): () => void {
  eventIndex = 0;

  intervalId = setInterval(() => {
    if (eventIndex >= QUEUED_EVENTS.length) {
      if (intervalId) clearInterval(intervalId);
      return;
    }

    const raw = QUEUED_EVENTS[eventIndex];
    eventIndex++;

    const entry: FeedEntry = { ...raw, id: makeId() };
    onEvent(entry);

    if (raw.type === "gated" && onGated) {
      const action: GatedAction = {
        id: makeId(),
        stepId: raw.stepId || "unknown",
        action: raw.content,
        command: raw.command || "",
        rationale: "Agent reasoning requires operator approval before proceeding.",
        riskLevel: "high",
        parameters: {},
      };
      onGated(action);
    }
  }, intervalMs);

  return () => {
    if (intervalId) clearInterval(intervalId);
  };
}

export function resetEventStream(): void {
  eventIndex = 0;
  idCounter = 0;
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}
