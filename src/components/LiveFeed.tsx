"use client";

import { useEffect, useRef } from "react";
import type { FeedEntry } from "@/lib/types";

interface LiveFeedProps {
  entries: FeedEntry[];
}

function entryTypeLabel(type: FeedEntry["type"]): string {
  const map: Record<FeedEntry["type"], string> = {
    action: "Action",
    reasoning: "Reasoning",
    result: "Result",
    gated: "Gated",
  };
  return map[type];
}

function entryTypeColor(type: FeedEntry["type"]): string {
  const map: Record<FeedEntry["type"], string> = {
    action: "text-status-progress",
    reasoning: "text-muted",
    result: "text-status-done",
    gated: "text-status-amber",
  };
  return map[type];
}

function entryBorderColor(type: FeedEntry["type"]): string {
  const map: Record<FeedEntry["type"], string> = {
    action: "border-l-status-progress",
    reasoning: "border-l-muted",
    result: "border-l-status-done",
    gated: "border-l-status-amber",
  };
  return map[type];
}

export function LiveFeed({ entries }: LiveFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div ref={feedRef} className="flex-1 overflow-y-auto p-4 space-y-3">
      {entries.length === 0 && (
        <div className="flex items-center justify-center h-full text-muted text-[13px]">
          Waiting for agent activity...
        </div>
      )}
      {entries.map((entry) => (
        <div
          key={entry.id}
          className={`border-l-2 pl-3 py-1 ${entryBorderColor(entry.type)}`}
        >
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-[11px] font-mono text-muted">
              {entry.timestamp}
            </span>
            <span
              className={`text-[10px] font-medium uppercase tracking-wider ${entryTypeColor(entry.type)}`}
            >
              {entryTypeLabel(entry.type)}
            </span>
          </div>
          <p className="text-[13px] text-foreground leading-relaxed">
            {entry.content}
          </p>
          {entry.command && (
            <code className="block mt-1.5 text-[11px] font-mono text-muted bg-white/5 border border-border rounded px-2.5 py-1.5 break-all">
              {entry.command}
            </code>
          )}
        </div>
      ))}
    </div>
  );
}
