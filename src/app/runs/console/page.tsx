"use client";

import { useState, useEffect } from "react";
import { generateRuns, generateFeedForRun, generateFindingsForRun } from "@/lib/mock-data";
import { startEventStream, resetEventStream } from "@/lib/event-stream";
import type { FeedEntry, GatedAction, Decision } from "@/lib/types";
import { StepTimeline } from "@/components/StepTimeline";
import { LiveFeed } from "@/components/LiveFeed";
import { ApprovalCard } from "@/components/ApprovalCard";
import { FindingsPanel } from "@/components/FindingsPanel";

export default function RunConsolePage() {
  const runs = generateRuns();
  const run = runs[0];
  const steps = run.steps;

  const [feedEntries, setFeedEntries] = useState<FeedEntry[]>(() =>
    generateFeedForRun()
  );
  const [pendingAction, setPendingAction] = useState<GatedAction | null>(null);
  const [resolvedDecision, setResolvedDecision] = useState<Decision | null>(null);
  const [rightPanel, setRightPanel] = useState<"findings" | "approval">("findings");

  const findings = generateFindingsForRun(run.id);

  useEffect(() => {
    resetEventStream();
    const cleanup = startEventStream(
      (entry) => setFeedEntries((prev) => [...prev, entry]),
      (action) => {
        setPendingAction(action);
        setRightPanel("approval");
      },
      4000
    );
    return cleanup;
  }, []);

  const handleDecide = (decision: Decision) => {
    decision.runId = run.id;
    setResolvedDecision(decision);
    setPendingAction(null);
    setTimeout(() => {
      setRightPanel("findings");
      setResolvedDecision(null);
    }, 5000);
  };

  return (
    <div className="flex-1 flex min-h-0">
      {/* Left column: metadata + timeline */}
      <div className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-[11px] uppercase tracking-wider text-muted font-medium mb-2">
            Run Details
          </p>
          <div className="space-y-2">
            <div>
              <p className="text-[10px] text-muted">Client / Scope</p>
              <p className="text-[12px] text-foreground">
                {run.client} &mdash; {run.scope}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted">Target</p>
              <p className="text-[13px] font-mono text-foreground">{run.target}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted">Agent</p>
              <p className="text-[12px] text-foreground">{run.agentName}</p>
            </div>
            <div>
              <p className="text-[10px] text-muted">Started</p>
              <p className="text-[12px] font-mono text-foreground">{run.startTime}</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <p className="text-[11px] uppercase tracking-wider text-muted font-medium mb-3">
            Step Timeline
          </p>
          <StepTimeline steps={steps} />
        </div>
      </div>

      {/* Center column: live feed */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-status-amber" />
            <h2 className="text-[13px] font-semibold text-foreground">
              Live Feed
            </h2>
          </div>
          <span className="text-[11px] font-mono text-muted">
            {feedEntries.length} events
          </span>
        </div>
        <LiveFeed entries={feedEntries} />
      </div>

      {/* Right column: findings / approval */}
      <div className="w-80 shrink-0 border-l border-border flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-border">
          <div className="flex gap-1">
            <button
              onClick={() => setRightPanel("findings")}
              className={`px-3 py-1.5 text-[11px] font-medium rounded transition-colors ${
                rightPanel === "findings"
                  ? "bg-white/10 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Findings
            </button>
            <button
              onClick={() => setRightPanel("approval")}
              className={`px-3 py-1.5 text-[11px] font-medium rounded transition-colors ${
                rightPanel === "approval"
                  ? "bg-white/10 text-foreground"
                  : "text-muted hover:text-foreground"
              }`}
            >
              Approval
              {pendingAction && !resolvedDecision && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-status-amber inline-block" />
              )}
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {rightPanel === "findings" ? (
            <FindingsPanel findings={findings} />
          ) : pendingAction ? (
            <ApprovalCard
              action={pendingAction}
              onDecide={handleDecide}
              resolved={resolvedDecision}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted text-[13px]">
              No pending approvals
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
