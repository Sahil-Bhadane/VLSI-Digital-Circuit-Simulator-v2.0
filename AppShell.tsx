import { Link, useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/gates", label: "Logic Gates" },
  { to: "/mux", label: "MUX / DEMUX" },
  { to: "/flipflops", label: "Flip-Flops" },
  { to: "/learn", label: "Learn" },
  { to: "/quiz", label: "Quiz" },
] as const;

export function AppShell({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-mono text-sm font-bold shadow-[0_0_20px_-4px_oklch(0.78_0.16_195/0.6)]">V</div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide">VLSI Sim</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">v2.0</div>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-1 text-sm">
            {NAV.map((n) => {
              const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <nav className="md:hidden flex items-center gap-1 overflow-x-auto px-4 pb-2 text-xs">
          {NAV.map((n) => {
            const active = n.to === "/" ? pathname === "/" : pathname.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`shrink-0 rounded-full px-3 py-1 ${active ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </main>
      <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        VLSI Digital Circuit Simulator · v2.0 · Built for learners & engineers
      </footer>
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border/60 bg-card p-5 shadow-sm ${className}`}>{children}</div>
  );
}

export function BitChip({ value, label }: { value: 0 | 1; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {label && <span className="font-mono text-xs text-muted-foreground">{label}=</span>}
      <span
        className={`grid h-7 w-7 place-items-center rounded-md font-mono text-sm font-bold transition-all ${
          value
            ? "bg-primary text-primary-foreground shadow-[0_0_14px_-2px_oklch(0.78_0.16_195/0.7)]"
            : "bg-secondary text-muted-foreground"
        }`}
      >
        {value}
      </span>
    </span>
  );
}

export function ToggleBit({ value, onChange, label }: { value: 0 | 1; onChange: (v: 0 | 1) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange((value ? 0 : 1) as 0 | 1)}
      className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 transition-all hover:bg-secondary"
    >
      <span className="font-mono text-xs text-muted-foreground">{label}</span>
      <span
        className={`grid h-8 w-8 place-items-center rounded-md font-mono text-base font-bold transition-all ${
          value
            ? "bg-primary text-primary-foreground shadow-[0_0_18px_-3px_oklch(0.78_0.16_195/0.8)]"
            : "bg-background text-muted-foreground"
        }`}
      >
        {value}
      </span>
    </button>
  );
}