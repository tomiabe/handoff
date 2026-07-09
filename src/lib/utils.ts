import type { Severity, RunStatus, StepStatus, FindingStatus, DecisionOutcome, RiskLevel } from "@/lib/types";

export function severityColor(s: Severity): string {
  const map: Record<Severity, string> = {
    critical: "text-severity-critical",
    high: "text-severity-high",
    medium: "text-severity-medium",
    low: "text-severity-low",
    info: "text-severity-info",
  };
  return map[s];
}

export function severityBg(s: Severity): string {
  const map: Record<Severity, string> = {
    critical: "bg-severity-critical/10",
    high: "bg-severity-high/10",
    medium: "bg-severity-medium/10",
    low: "bg-severity-low/10",
    info: "bg-severity-info/10",
  };
  return map[s];
}

export function severityBorder(s: Severity): string {
  const map: Record<Severity, string> = {
    critical: "border-severity-critical/20",
    high: "border-severity-high/20",
    medium: "border-severity-medium/20",
    low: "border-severity-low/20",
    info: "border-severity-info/20",
  };
  return map[s];
}

export function runStatusLabel(s: RunStatus): string {
  const map: Record<RunStatus, string> = {
    running: "Running",
    awaiting_approval: "Awaiting Approval",
    completed: "Completed",
    failed: "Failed",
  };
  return map[s];
}

export function runStatusColor(s: RunStatus): string {
  const map: Record<RunStatus, string> = {
    running: "text-status-progress",
    awaiting_approval: "text-status-amber",
    completed: "text-status-done",
    failed: "text-status-failed",
  };
  return map[s];
}

export function runStatusBg(s: RunStatus): string {
  const map: Record<RunStatus, string> = {
    running: "bg-status-progress/10",
    awaiting_approval: "bg-status-amber/10",
    completed: "bg-status-done/10",
    failed: "bg-status-failed/10",
  };
  return map[s];
}

export function stepStatusColor(s: StepStatus): string {
  const map: Record<StepStatus, string> = {
    done: "text-status-done",
    in_progress: "text-status-progress",
    awaiting_approval: "text-status-amber",
    denied: "text-status-failed",
    skipped: "text-status-idle",
  };
  return map[s];
}

export function stepStatusIcon(s: StepStatus): string {
  const map: Record<StepStatus, string> = {
    done: "\u2713",
    in_progress: "\u25cf",
    awaiting_approval: "\u25cb",
    denied: "\u2717",
    skipped: "\u2014",
  };
  return map[s];
}

export function findingStatusLabel(s: FindingStatus): string {
  const map: Record<FindingStatus, string> = {
    open: "Open",
    acknowledged: "Acknowledged",
    dismissed: "Dismissed",
  };
  return map[s];
}

export function findingStatusColor(s: FindingStatus): string {
  const map: Record<FindingStatus, string> = {
    open: "text-severity-high",
    acknowledged: "text-status-amber",
    dismissed: "text-muted",
  };
  return map[s];
}

export function decisionLabel(o: DecisionOutcome): string {
  const map: Record<DecisionOutcome, string> = {
    approved: "Approved",
    denied: "Denied",
    edited_and_approved: "Edited & Approved",
  };
  return map[o];
}

export function decisionColor(o: DecisionOutcome): string {
  const map: Record<DecisionOutcome, string> = {
    approved: "text-decision-approved",
    denied: "text-decision-denied",
    edited_and_approved: "text-decision-edited",
  };
  return map[o];
}

export function riskLabel(r: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: "High Risk",
    critical: "Critical Risk",
  };
  return map[r];
}

export function riskColor(r: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: "text-severity-high",
    critical: "text-severity-critical",
  };
  return map[r];
}
