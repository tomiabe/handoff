"use client";

import { useState, useRef, useEffect } from "react";
import type { GatedAction, Decision } from "@/lib/types";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface ApprovalCardProps {
  action: GatedAction;
  onDecide: (decision: Decision) => void;
  resolved?: Decision | null;
}

export function ApprovalCard({ action, onDecide, resolved }: ApprovalCardProps) {
  const [editing, setEditing] = useState(false);
  const [parameters, setParameters] = useState(
    JSON.stringify(action.parameters, null, 2)
  );
  const [note, setNote] = useState("");
  const approveRef = useRef<HTMLButtonElement>(null);
  const denyRef = useRef<HTMLButtonElement>(null);
  const editRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (resolved) return;
      if (e.key === "a" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        approveRef.current?.click();
      }
      if (e.key === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        denyRef.current?.click();
      }
      if (e.key === "e" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        editRef.current?.click();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [resolved]);

  if (resolved) {
    return (
      <div className="border border-border rounded-lg bg-surface p-5">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[13px] font-semibold text-foreground">
            Decision Recorded
          </h3>
          <Badge variant="decision" decision={resolved.outcome}>
            {resolved.outcome === "approved"
              ? "Approved"
              : resolved.outcome === "denied"
                ? "Denied"
                : "Edited & Approved"}
          </Badge>
        </div>
        <p className="text-[13px] text-muted mb-2">{resolved.actionProposed}</p>
        {resolved.operatorNote && (
          <p className="text-[12px] text-muted font-mono mt-2 border-l-2 border-border pl-3">
            {resolved.operatorNote}
          </p>
        )}
        <p className="text-[11px] text-muted font-mono mt-3">
          Decided at {resolved.timestamp}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-status-amber/30 rounded-lg bg-surface p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-amber" />
          <h3 className="text-[13px] font-semibold text-foreground">
            Approval Required
          </h3>
        </div>
        <Badge variant="risk" risk={action.riskLevel}>
          {action.riskLevel === "critical" ? "Critical Risk" : "High Risk"}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted mb-1 font-medium">
            What the agent wants to do
          </p>
          <p className="text-[13px] text-foreground">{action.action}</p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted mb-1 font-medium">
            Command
          </p>
          <code className="block text-[12px] font-mono text-foreground bg-white/5 border border-border rounded px-3 py-2 break-all">
            {action.command}
          </code>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-wider text-muted mb-1 font-medium">
            Agent reasoning
          </p>
          <p className="text-[12px] text-muted leading-relaxed">
            {action.rationale}
          </p>
        </div>
      </div>

      {editing && (
        <div className="mb-4 space-y-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted mb-1 font-medium">
              Parameters (editable)
            </p>
            <textarea
              value={parameters}
              onChange={(e) => setParameters(e.target.value)}
              className="w-full h-32 text-[12px] font-mono text-foreground bg-white/5 border border-border rounded px-3 py-2 resize-none focus:outline-none focus:border-status-progress"
              spellCheck={false}
            />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted mb-1 font-medium">
              Operator note
            </p>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Optional note for the decision log"
              className="w-full h-8 text-[12px] text-foreground bg-white/5 border border-border rounded px-3 focus:outline-none focus:border-status-progress placeholder:text-muted/50"
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            ref={approveRef}
            variant="primary"
            size="sm"
            onClick={() =>
              onDecide({
                id: `dec-${Date.now()}`,
                runId: "",
                timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
                actionProposed: action.action,
                outcome: "approved",
                operatorNote: note || null,
                agentRationale: action.rationale,
                riskLevel: action.riskLevel,
              })
            }
          >
            Approve
            <span className="text-[10px] opacity-50 ml-1">A</span>
          </Button>
          <Button
            ref={denyRef}
            variant="danger"
            size="sm"
            onClick={() =>
              onDecide({
                id: `dec-${Date.now()}`,
                runId: "",
                timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
                actionProposed: action.action,
                outcome: "denied",
                operatorNote: note || null,
                agentRationale: action.rationale,
                riskLevel: action.riskLevel,
              })
            }
          >
            Deny
            <span className="text-[10px] opacity-50 ml-1">D</span>
          </Button>
        </div>
        <Button
          ref={editRef}
          variant="secondary"
          size="sm"
          onClick={() => {
            if (editing) {
              onDecide({
                id: `dec-${Date.now()}`,
                runId: "",
                timestamp: new Date().toLocaleTimeString("en-US", { hour12: false }),
                actionProposed: action.action,
                outcome: "edited_and_approved",
                operatorNote: note || null,
                agentRationale: action.rationale,
                riskLevel: action.riskLevel,
              });
            } else {
              setEditing(true);
            }
          }}
        >
          {editing ? "Confirm Edit" : "Edit & Approve"}
          <span className="text-[10px] opacity-50 ml-1">E</span>
        </Button>
      </div>

      <p className="text-[10px] text-muted mt-2 font-mono">
        Keyboard: A = Approve, D = Deny, E = Edit
      </p>
    </div>
  );
}
