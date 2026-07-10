"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/runs", label: "Runs", icon: "▶" },
  { href: "/findings", label: "Findings", icon: "⚠" },
  { href: "/decisions", label: "Decisions", icon: "✎" },
];

export function Sidebar() {
  const pathname = usePathname();

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  return (
    <aside className="w-full lg:w-56 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-border bg-surface flex flex-col">
      <div className="px-4 py-3 lg:py-5 border-b border-border flex items-center justify-between lg:block">
        <Link href="/runs" className="block">
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            Handoff
          </h1>
          <p className="hidden lg:block text-[11px] text-muted mt-0.5 font-mono">
            pentest / red-team agent console
          </p>
        </Link>

        {/* Mobile/tablet: horizontal tab strip */}
        <nav className="flex lg:hidden items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[12px] transition-colors ${
                isItemActive(item.href)
                  ? "text-foreground bg-white/10"
                  : "text-muted hover:text-foreground hover:bg-white/[0.05]"
              }`}
            >
              <span className="text-[11px] opacity-60">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Desktop: vertical nav */}
      <nav className="hidden lg:block flex-1 py-2">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${
              isItemActive(item.href)
                ? "text-foreground bg-white/5"
                : "text-muted hover:text-foreground hover:bg-white/[0.03]"
            }`}
          >
            <span className="text-[11px] w-4 text-center opacity-60">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="hidden lg:block px-4 py-3 border-t border-border space-y-1">
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
