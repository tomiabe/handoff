import type { Severity, RunStatus, StepStatus, FindingStatus, DecisionOutcome, RiskLevel } from "@/lib/types";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "severity" | "status" | "risk" | "decision";
  severity?: Severity;
  status?: RunStatus | StepStatus | FindingStatus;
  decision?: DecisionOutcome;
  risk?: RiskLevel;
  className?: string;
}

function severityStyles(s: Severity): string {
  const map: Record<Severity, string> = {
    critical: "bg-severity-critical/10 text-severity-critical border-severity-critical/20",
    high: "bg-severity-high/10 text-severity-high border-severity-high/20",
    medium: "bg-severity-medium/10 text-severity-medium border-severity-medium/20",
    low: "bg-severity-low/10 text-severity-low border-severity-low/20",
    info: "bg-severity-info/10 text-severity-info border-severity-info/20",
  };
  return map[s];
}

function runStatusStyles(s: RunStatus): string {
  const map: Record<RunStatus, string> = {
    running: "bg-status-progress/10 text-status-progress border-status-progress/20",
    awaiting_approval: "bg-status-amber/10 text-status-amber border-status-amber/20",
    completed: "bg-status-done/10 text-status-done border-status-done/20",
    failed: "bg-status-failed/10 text-status-failed border-status-failed/20",
  };
  return map[s];
}

function decisionStyles(d: DecisionOutcome): string {
  const map: Record<DecisionOutcome, string> = {
    approved: "bg-decision-approved/10 text-decision-approved border-decision-approved/20",
    denied: "bg-decision-denied/10 text-decision-denied border-decision-denied/20",
    edited_and_approved: "bg-decision-edited/10 text-decision-edited border-decision-edited/20",
  };
  return map[d];
}

function riskStyles(r: RiskLevel): string {
  const map: Record<RiskLevel, string> = {
    high: "bg-severity-high/10 text-severity-high border-severity-high/20",
    critical: "bg-severity-critical/10 text-severity-critical border-severity-critical/20",
  };
  return map[r];
}

export function Badge({
  children,
  variant = "default",
  severity,
  status,
  decision,
  risk,
  className = "",
}: BadgeProps) {
  let styles = "bg-white/5 text-muted border-white/10";

  if (variant === "severity" && severity) styles = severityStyles(severity);
  else if (variant === "status" && status)
    styles = runStatusStyles(status as RunStatus);
  else if (variant === "decision" && decision) styles = decisionStyles(decision);
  else if (variant === "risk" && risk) styles = riskStyles(risk);

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium font-mono border rounded ${styles} ${className}`}
    >
      {children}
    </span>
  );
}
