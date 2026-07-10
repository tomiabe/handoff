"use client";

import Link from "next/link";
import { generateRuns } from "@/lib/mock-data";
import { Badge } from "@/components/Badge";
import { runStatusLabel } from "@/lib/utils";

const runs = generateRuns();

function statusDot(status: string): string {
  const map: Record<string, string> = {
    running: "bg-status-progress",
    awaiting_approval: "bg-status-amber",
    completed: "bg-status-done",
    failed: "bg-status-failed",
  };
  return map[status] || "bg-muted";
}

export default function RunsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-6 py-5 border-b border-border">
        <h1 className="text-[15px] font-semibold text-foreground">Runs</h1>
        <p className="text-[12px] text-muted mt-0.5">
          Autonomous pentest &amp; red-team agent engagements, live and past
        </p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Mobile/tablet: stacked cards */}
        <div className="md:hidden divide-y divide-border">
          {runs.map((run) => (
            <Link
              key={run.id}
              href="/runs/console"
              className="block px-4 py-4 hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${statusDot(run.status)}`} />
                  <Badge variant="status" status={run.status}>
                    {runStatusLabel(run.status)}
                  </Badge>
                </div>
                {run.pendingApprovals > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-status-amber">
                    <span className="w-1.5 h-1.5 rounded-full bg-status-amber" />
                    {run.pendingApprovals}
                  </span>
                )}
              </div>
              <p className="text-[13px] font-mono text-foreground mt-2">
                {run.target}
              </p>
              <p className="text-[11px] text-muted mt-0.5">
                {run.client} &mdash; {run.scope}
              </p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1.5 mt-3 text-[11px] text-muted font-mono">
                <span>{run.agentName}</span>
                <span>{run.startTime}</span>
                <span>{run.duration || "—"}</span>
                <span>{run.findingsCount} findings</span>
                {run.highestSeverity && (
                  <Badge variant="severity" severity={run.highestSeverity}>
                    {run.highestSeverity}
                  </Badge>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Status
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Target
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Agent
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Started
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Duration
              </th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Findings
              </th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Severity
              </th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Approvals
              </th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr
                key={run.id}
                className="border-b border-border hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-3.5">
                  <Link
                    href="/runs/console"
                    className="flex items-center gap-2 group"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${statusDot(run.status)}`}
                    />
                    <Badge variant="status" status={run.status}>
                      {runStatusLabel(run.status)}
                    </Badge>
                  </Link>
                </td>
                <td className="px-6 py-3.5">
                  <Link href="/runs/console" className="block group">
                    <span className="text-[13px] font-mono text-foreground group-hover:text-status-progress transition-colors">
                      {run.target}
                    </span>
                    <span className="block text-[11px] text-muted mt-0.5">
                      {run.client} &mdash; {run.scope}
                    </span>
                  </Link>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-muted font-mono">
                    {run.agentName}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-muted font-mono">
                    {run.startTime}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-muted font-mono">
                    {run.duration || "\u2014"}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <span className="text-[12px] text-foreground font-mono">
                    {run.findingsCount}
                  </span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  {run.highestSeverity ? (
                    <Badge variant="severity" severity={run.highestSeverity}>
                      {run.highestSeverity}
                    </Badge>
                  ) : (
                    <span className="text-[12px] text-muted">&mdash;</span>
                  )}
                </td>
                <td className="px-6 py-3.5 text-right">
                  {run.pendingApprovals > 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-mono text-status-amber">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-amber" />
                      {run.pendingApprovals}
                    </span>
                  ) : (
                    <span className="text-[12px] text-muted font-mono">&mdash;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
