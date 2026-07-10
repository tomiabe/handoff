"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/runs", label: "Runs", icon: "\u25b6" },
  { href: "/findings", label: "Findings", icon: "\u26a0" },
  { href: "/decisions", label: "Decisions", icon: "\u270e" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-surface flex flex-col">
      <div className="px-4 py-5 border-b border-border">
        <Link href="/runs" className="block">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Handoff
          </h1>
          <p className="text-[11px] text-muted mt-0.5 font-mono">
            pentest / red-team agent console
          </p>
        </Link>
      </div>
      <nav className="flex-1 py-2">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${
                isActive
                  ? "text-foreground bg-white/5"
                  : "text-muted hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <span className="text-[11px] w-4 text-center opacity-60">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-3 border-t border-border space-y-1">
        <p className="text-[10px] text-status-amber font-mono leading-relaxed">
          Human-in-the-loop approval gate
        </p>
        <p className="text-[10px] text-muted font-mono leading-relaxed">
          Simulated data &mdash; portfolio demo
        </p>
      </div>
    </aside>
  );
}
