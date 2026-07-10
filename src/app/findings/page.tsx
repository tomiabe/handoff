"use client";

import { useState, useMemo } from "react";
import { generateAllFindings } from "@/lib/mock-data";
import { Badge } from "@/components/Badge";
import { findingStatusLabel, findingStatusColor } from "@/lib/utils";
import type { Severity, FindingStatus } from "@/lib/types";

const allFindings = generateAllFindings();

const SEVERITY_ORDER: Severity[] = ["critical", "high", "medium", "low", "info"];
const STATUS_OPTIONS: FindingStatus[] = ["open", "acknowledged", "dismissed"];

export default function FindingsPage() {
  const [severityFilter, setSeverityFilter] = useState<Severity | "all">("all");
  const [statusFilter, setStatusFilter] = useState<FindingStatus | "all">("all");
  const [sortKey, setSortKey] = useState<"severity" | "timestamp">("severity");

  const filtered = useMemo(() => {
    let result = [...allFindings];
    if (severityFilter !== "all") {
      result = result.filter((f) => f.severity === severityFilter);
    }
    if (statusFilter !== "all") {
      result = result.filter((f) => f.status === statusFilter);
    }
    if (sortKey === "severity") {
      result.sort(
        (a, b) => SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity)
      );
    } else {
      result.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    }
    return result;
  }, [severityFilter, statusFilter, sortKey]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-6 py-5 border-b border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[15px] font-semibold text-foreground">
              Findings
            </h1>
            <p className="text-[12px] text-muted mt-0.5">
              All findings across agent runs
            </p>
          </div>
          <span className="text-[12px] font-mono text-muted mt-1">
            {filtered.length} findings
          </span>
        </div>

        <div className="flex items-center gap-3 mt-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Severity:</span>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as Severity | "all")}
              className="h-7 text-[12px] font-mono text-foreground bg-surface border border-border rounded px-2 focus:outline-none focus:border-status-progress"
            >
              <option value="all">All</option>
              {SEVERITY_ORDER.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as FindingStatus | "all")}
              className="h-7 text-[12px] font-mono text-foreground bg-surface border border-border rounded px-2 focus:outline-none focus:border-status-progress"
            >
              <option value="all">All</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {findingStatusLabel(s)}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-muted">Sort:</span>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as "severity" | "timestamp")}
              className="h-7 text-[12px] font-mono text-foreground bg-surface border border-border rounded px-2 focus:outline-none focus:border-status-progress"
            >
              <option value="severity">Severity</option>
              <option value="timestamp">Timestamp</option>
            </select>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Mobile/tablet: stacked cards */}
        <div className="md:hidden divide-y divide-border">
          {filtered.map((f) => (
            <div key={f.id} className="px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="severity" severity={f.severity}>
                  {f.severity}
                </Badge>
                <span className="text-[11px] font-mono text-muted">
                  {f.timestamp}
                </span>
              </div>
              <p className="text-[13px] text-foreground mt-2">{f.title}</p>
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] font-mono text-muted">
                <span>{f.asset}</span>
                <span>{f.confidence}% confidence</span>
                <span className={findingStatusColor(f.status)}>
                  {findingStatusLabel(f.status)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Severity
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Finding
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Asset
              </th>
              <th className="text-right text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Confidence
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Status
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Time
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((f) => (
              <tr
                key={f.id}
                className="border-b border-border hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-3">
                  <Badge variant="severity" severity={f.severity}>
                    {f.severity}
                  </Badge>
                </td>
                <td className="px-6 py-3">
                  <span className="text-[13px] text-foreground">{f.title}</span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-[12px] font-mono text-muted">
                    {f.asset}
                  </span>
                </td>
                <td className="px-6 py-3 text-right">
                  <span className="text-[12px] font-mono text-muted">
                    {f.confidence}%
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span
                    className={`text-[12px] font-medium ${findingStatusColor(f.status)}`}
                  >
                    {findingStatusLabel(f.status)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className="text-[12px] font-mono text-muted">
                    {f.timestamp}
                  </span>
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
