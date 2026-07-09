import type {
  Run,
  Finding,
  Decision,
  FeedEntry,
  GatedAction,
  Step,
} from "./types";

const TARGETS = [
  "acme-staging.internal",
  "globex-prod.net",
  "initech-sandbox.io",
  "umbrella-ci.cloud",
  "wayne-mgmt.dev",
];

const AGENT_NAMES = [
  "Sentinel-01",
  "Watcher-03",
  "Probe-07",
  "Audit-12",
  "Recon-05",
];

const SEVERITIES: Finding["severity"][] = [
  "critical",
  "high",
  "medium",
  "low",
  "info",
];

const FINDING_TITLES: Record<Finding["severity"], string[]> = {
  critical: [
    "Remote code execution via deserialization flaw",
    "Hardcoded root credentials in config file",
    "Unauthenticated admin API endpoint exposed",
  ],
  high: [
    "SQL injection in login form parameter",
    "Privilege escalation through role misconfiguration",
    "Exposed internal service on public interface",
    "Weak TLS configuration allowing downgrade attacks",
  ],
  medium: [
    "Cross-site scripting in search query handler",
    "Missing rate limiting on authentication endpoint",
    "Information disclosure in error responses",
    "Insecure session token rotation policy",
  ],
  low: [
    "Server version banner disclosure",
    "Missing security headers on static assets",
    "Cookie without Secure flag set",
    "Deprecated TLS protocol version supported",
  ],
  info: [
    "DNS zone transfer possible to secondary server",
    "HTTP methods not restricted on API endpoint",
    "Server running in debug mode",
    "CORS policy allows wildcard origins",
  ],
};

const ASSETS = [
  "web-server-01",
  "db-primary",
  "api-gateway",
  "auth-service",
  "cache-layer",
  "worker-queue",
  "static-cdn",
  "admin-panel",
  "backup-node",
  "monitoring-agent",
];

function randomId(): string {
  return Math.random().toString(36).substring(2, 10);
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateSteps(): Step[] {
  const steps: Step[] = [
    {
      id: randomId(),
      label: "Initialize target reconnaissance",
      status: "done",
    },
    {
      id: randomId(),
      label: "Enumerate network services",
      status: "done",
      command: "nmap -sV -p 1-65535 {target}",
    },
    {
      id: randomId(),
      label: "Probe web application endpoints",
      status: "done",
      command: "httpx -target {target} -ports 80,443,8080",
    },
    {
      id: randomId(),
      label: "Run directory brute-force",
      status: "done",
      command: "feroxbuster -u https://{target} -w common.txt",
    },
    {
      id: randomId(),
      label: "Test authentication bypass vectors",
      status: "awaiting_approval",
      command: "sqlmap -u 'https://{target}/login' --batch --risk=3",
      rationale:
        "Automated SQL injection testing is irreversible against the target and may trigger WAF alerts. Manual approval required before proceeding.",
      riskLevel: "high",
      gated: true,
    },
    {
      id: randomId(),
      label: "Attempt privilege escalation",
      status: "awaiting_approval",
      command: "curl -X POST https://{target}/api/admin/roles -d '{role:admin}'",
      rationale:
        "Modifying user roles is a destructive action that could lock out legitimate users. Requires explicit operator approval.",
      riskLevel: "critical",
      gated: true,
    },
    {
      id: randomId(),
      label: "Exfiltrate sample data for validation",
      status: "skipped",
      command: "pg_dump --data-only --table=users {db_connection}",
      rationale:
        "Data exfiltration carries legal and operational risk. Only approved in controlled environments.",
      riskLevel: "critical",
      gated: true,
    },
    {
      id: randomId(),
      label: "Compile findings report",
      status: "skipped",
    },
    {
      id: randomId(),
      label: "Generate remediation recommendations",
      status: "skipped",
    },
  ];
  return steps;
}

function generateFeedEntries(steps: Step[]): FeedEntry[] {
  const entries: FeedEntry[] = [];

  entries.push({
    id: randomId(),
    timestamp: "14:02:13",
    type: "action",
    content: "Agent initialized. Beginning reconnaissance against target.",
    stepId: steps[0].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:02:15",
    type: "result",
    content:
      "Target resolved: 198.51.100.42. Open ports: 80/tcp, 443/tcp, 8080/tcp, 5432/tcp.",
    stepId: steps[1].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:02:18",
    type: "reasoning",
    content:
      "Four open ports detected. Web application likely running on 443. Database on 5432 should be investigated for direct access.",
    stepId: steps[1].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:02:31",
    type: "action",
    content: "Running HTTP service discovery on detected web ports.",
    stepId: steps[2].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:02:34",
    type: "result",
    content:
      "HTTPS service confirmed on port 443. Server: nginx/1.24.0. 47 endpoints discovered including /api/v1/*, /admin, /login.",
    stepId: steps[2].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:02:45",
    type: "reasoning",
    content:
      "Admin panel detected at /admin. Login form present with standard username/password fields. Proceeding with directory enumeration.",
    stepId: steps[3].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:03:02",
    type: "action",
    content: "Executing recursive directory and file brute-force.",
    stepId: steps[3].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:03:18",
    type: "result",
    content:
      "2,847 paths discovered. Notable: /api/v1/export, /debug/health, /backup/2024-01.tar.gz, /.env.example",
    stepId: steps[3].id,
  });

  entries.push({
    id: randomId(),
    timestamp: "14:03:22",
    type: "gated",
    content:
      "Agent proposes automated SQL injection testing against login endpoint. This action is high-risk and irreversible — it may trigger security alerts and modify request patterns against the target.",
    command: "sqlmap -u 'https://acme-staging.internal/login' --batch --risk=3 --level=5",
    stepId: steps[4].id,
  });

  return entries;
}

function generateFindings(runId: string): Finding[] {
  const findings: Finding[] = [];

  for (let i = 0; i < 12; i++) {
    const severity = randomFrom(SEVERITIES);
    const titles = FINDING_TITLES[severity];
    findings.push({
      id: randomId(),
      runId,
      severity,
      title: randomFrom(titles),
      asset: randomFrom(ASSETS),
      confidence: Math.round(70 + Math.random() * 30),
      status: i < 3 ? "open" : i < 7 ? "acknowledged" : "dismissed",
      timestamp: `14:0${2 + Math.floor(i / 3)}:${String(13 + i * 7).padStart(2, "0")}`,
    });
  }

  return findings;
}

function generateDecisions(runId: string): Decision[] {
  return [
    {
      id: randomId(),
      runId,
      timestamp: "14:03:22",
      actionProposed: "Automated SQL injection testing against login endpoint",
      outcome: "approved",
      operatorNote: "Approved — target is in isolated staging environment.",
      agentRationale:
        "Login form shows indicators of potential injection vulnerability. Automated testing will confirm or rule out the finding.",
      riskLevel: "high",
    },
    {
      id: randomId(),
      runId,
      timestamp: "14:05:41",
      actionProposed: "Privilege escalation via role modification API",
      outcome: "denied",
      operatorNote: "Denied — out of scope for this assessment.",
      agentRationale:
        "API endpoint allows role changes without proper authorization checks. Exploiting this would demonstrate full compromise path.",
      riskLevel: "critical",
    },
    {
      id: randomId(),
      runId,
      timestamp: "14:08:17",
      actionProposed: "Database table exfiltration for credential validation",
      outcome: "edited_and_approved",
      operatorNote:
        "Approved with modification — limit to first 5 rows of users table only.",
      agentRationale:
        "Direct database access confirmed. Exfiltrating sample data validates the impact of the exposed database service.",
      riskLevel: "critical",
    },
  ];
}

export function generateRun(id?: string): Run {
  const runId = id || randomId();
  const steps = generateSteps();
  const status = steps.some((s) => s.status === "awaiting_approval")
    ? ("awaiting_approval" as const)
    : ("completed" as const);

  return {
    id: runId,
    target: randomFrom(TARGETS),
    agentName: randomFrom(AGENT_NAMES),
    status,
    startTime: "14:02:13 UTC",
    duration: status === "completed" ? "12m 47s" : null,
    findingsCount: 12,
    highestSeverity: "critical",
    steps,
  };
}

export function generateRuns(): Run[] {
  return [
    {
      ...generateRun("run-001"),
      target: "acme-staging.internal",
      agentName: "Sentinel-01",
      status: "awaiting_approval",
      duration: null,
      startTime: "14:02:13 UTC",
      findingsCount: 12,
      highestSeverity: "critical",
    },
    {
      ...generateRun("run-002"),
      target: "globex-prod.net",
      agentName: "Watcher-03",
      status: "completed",
      duration: "23m 11s",
      startTime: "13:41:05 UTC",
      findingsCount: 8,
      highestSeverity: "high",
    },
    {
      ...generateRun("run-003"),
      target: "initech-sandbox.io",
      agentName: "Probe-07",
      status: "completed",
      duration: "8m 34s",
      startTime: "13:22:48 UTC",
      findingsCount: 3,
      highestSeverity: "medium",
    },
    {
      ...generateRun("run-004"),
      target: "umbrella-ci.cloud",
      agentName: "Audit-12",
      status: "failed",
      duration: "4m 02s",
      startTime: "12:58:33 UTC",
      findingsCount: 0,
      highestSeverity: null,
    },
    {
      ...generateRun("run-005"),
      target: "wayne-mgmt.dev",
      agentName: "Recon-05",
      status: "completed",
      duration: "31m 09s",
      startTime: "12:15:22 UTC",
      findingsCount: 15,
      highestSeverity: "critical",
    },
  ];
}

export function generateFeedForRun(): FeedEntry[] {
  const steps = generateSteps();
  return generateFeedEntries(steps);
}

export function generateFindingsForRun(runId: string): Finding[] {
  return generateFindings(runId);
}

export function generateDecisionsForRun(runId: string): Decision[] {
  return generateDecisions(runId);
}

export function generateAllFindings(): Finding[] {
  const runs = generateRuns();
  const findings: Finding[] = [];
  for (const run of runs) {
    findings.push(...generateFindingsForRun(run.id));
  }
  return findings;
}

export function generateAllDecisions(): Decision[] {
  const runs = generateRuns();
  const decisions: Decision[] = [];
  for (const run of runs) {
    decisions.push(...generateDecisionsForRun(run.id));
  }
  return decisions;
}

export function getPendingGatedAction(): GatedAction {
  return {
    id: randomId(),
    stepId: "gated-1",
    action: "Run automated SQL injection testing against login form",
    command: "sqlmap -u 'https://acme-staging.internal/login' --batch --risk=3 --level=5",
    rationale:
      "The login form accepts unsanitized input in the username parameter. Automated SQL injection testing will confirm whether the application is vulnerable to credential bypass or data extraction. This is a standard penetration testing technique used to validate suspected vulnerabilities.",
    riskLevel: "high",
    parameters: {
      target_url: "https://acme-staging.internal/login",
      parameter: "username",
      risk: "3",
      level: "5",
      batch: "true",
    },
  };
}
