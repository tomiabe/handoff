export type RunStatus = "running" | "awaiting_approval" | "completed" | "failed";

export type StepStatus =
  | "done"
  | "in_progress"
  | "awaiting_approval"
  | "denied"
  | "skipped";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

export type FindingStatus = "open" | "acknowledged" | "dismissed";

export type DecisionOutcome = "approved" | "denied" | "edited_and_approved";

export type RiskLevel = "high" | "critical";

export interface Run {
  id: string;
  target: string;
  agentName: string;
  client: string;
  scope: string;
  status: RunStatus;
  startTime: string;
  duration: string | null;
  findingsCount: number;
  highestSeverity: Severity | null;
  pendingApprovals: number;
  steps: Step[];
}

export interface Step {
  id: string;
  label: string;
  status: StepStatus;
  command?: string;
  rationale?: string;
  riskLevel?: RiskLevel;
  gated?: boolean;
}

export interface FeedEntry {
  id: string;
  timestamp: string;
  type: "action" | "reasoning" | "result" | "gated";
  content: string;
  command?: string;
  stepId?: string;
}

export interface Finding {
  id: string;
  runId: string;
  severity: Severity;
  title: string;
  asset: string;
  confidence: number;
  status: FindingStatus;
  timestamp: string;
}

export interface Decision {
  id: string;
  runId: string;
  timestamp: string;
  actionProposed: string;
  outcome: DecisionOutcome;
  operatorNote: string | null;
  agentRationale: string;
  riskLevel: RiskLevel;
}

export interface GatedAction {
  id: string;
  stepId: string;
  action: string;
  command: string;
  rationale: string;
  riskLevel: RiskLevel;
  parameters: Record<string, string>;
}
