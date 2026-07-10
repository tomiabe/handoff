"use client";

import { generateAllDecisions } from "@/lib/mock-data";
import { Badge } from "@/components/Badge";
import { decisionLabel, decisionColor } from "@/lib/utils";

const allDecisions = generateAllDecisions();

export default function DecisionsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <header className="px-6 py-5 border-b border-border">
        <h1 className="text-[15px] font-semibold text-foreground">
          Decision Log
        </h1>
        <p className="text-[12px] text-muted mt-0.5">
          Audit record of every gated decision made during agent runs
        </p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {/* Mobile/tablet: stacked cards */}
        <div className="md:hidden divide-y divide-border">
          {allDecisions.map((d) => (
            <div key={d.id} className="px-4 py-4">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="risk" risk={d.riskLevel}>
                  {d.riskLevel}
                </Badge>
                <span className="text-[11px] font-mono text-muted">
                  {d.timestamp}
                </span>
              </div>
              <p className="text-[13px] text-foreground mt-2">
                {d.actionProposed}
              </p>
              <p className="text-[12px] text-muted leading-relaxed mt-1">
                {d.agentRationale}
              </p>
              <p
                className={`text-[12px] font-medium mt-2 ${decisionColor(d.outcome)}`}
              >
                {decisionLabel(d.outcome)}
              </p>
              {d.operatorNote && (
                <p className="text-[12px] text-muted font-mono mt-2 border-l-2 border-border pl-2">
                  {d.operatorNote}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Time
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Risk
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Action Proposed
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Agent Reasoning
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Decision
              </th>
              <th className="text-left text-[11px] uppercase tracking-wider text-muted font-medium px-6 py-3">
                Operator Note
              </th>
            </tr>
          </thead>
          <tbody>
            {allDecisions.map((d) => (
              <tr
                key={d.id}
                className="border-b border-border hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-6 py-3.5">
                  <span className="text-[12px] font-mono text-muted">
                    {d.timestamp}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <Badge variant="risk" risk={d.riskLevel}>
                    {d.riskLevel}
                  </Badge>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[13px] text-foreground">
                    {d.actionProposed}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-muted leading-relaxed line-clamp-2">
                    {d.agentRationale}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span
                    className={`text-[12px] font-medium ${decisionColor(d.outcome)}`}
                  >
                    {decisionLabel(d.outcome)}
                  </span>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-[12px] text-muted">
                    {d.operatorNote || "\u2014"}
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
