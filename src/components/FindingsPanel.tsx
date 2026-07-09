import type { Finding } from "@/lib/types";
import { Badge } from "./Badge";
import { findingStatusLabel, findingStatusColor } from "@/lib/utils";

interface FindingsPanelProps {
  findings: Finding[];
}

export function FindingsPanel({ findings }: FindingsPanelProps) {
  const open = findings.filter((f) => f.status === "open");

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[11px] uppercase tracking-wider text-muted font-medium">
          Findings
        </h3>
        <span className="text-[11px] font-mono text-muted">
          {open.length} open / {findings.length} total
        </span>
      </div>
      <div className="space-y-2">
        {findings.map((f) => (
          <div
            key={f.id}
            className="border border-border rounded px-3 py-2.5 bg-surface"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <Badge variant="severity" severity={f.severity}>
                {f.severity}
              </Badge>
              <span
                className={`text-[11px] font-mono ${findingStatusColor(f.status)}`}
              >
                {findingStatusLabel(f.status)}
              </span>
            </div>
            <p className="text-[12px] text-foreground leading-snug mb-1">
              {f.title}
            </p>
            <div className="flex items-center gap-3 text-[11px] text-muted font-mono">
              <span>{f.asset}</span>
              <span>{f.confidence}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
