import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, Card } from "../components/AppShell";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VLSI Digital Circuit Simulator v2.0" },
      { name: "description", content: "Interactive simulator for logic gates, multiplexers, demultiplexers, and flip-flops with a built-in learning center and quiz." },
      { property: "og:title", content: "VLSI Digital Circuit Simulator v2.0" },
      { property: "og:description", content: "Learn and simulate digital circuits in your browser." },
    ],
  }),
  component: Index,
});

const MODULES = [
  { to: "/gates", title: "Logic Gates", desc: "AND, OR, NOT, NAND, NOR, XOR, XNOR — with live truth tables.", tag: "Combinational" },
  { to: "/mux", title: "MUX / DEMUX", desc: "2:1, 4:1, 8:1 multiplexers and 1:2/1:4/1:8 demultiplexers.", tag: "Combinational" },
  { to: "/flipflops", title: "Flip-Flops", desc: "SR, D, JK and T flip-flops with clock-edge simulation.", tag: "Sequential" },
  { to: "/learn", title: "Learn", desc: "Concise theory cards on boolean algebra and digital design.", tag: "Theory" },
  { to: "/quiz", title: "Quiz", desc: "Test your understanding with an instant-feedback quiz.", tag: "Practice" },
] as const;

function Index() {
  return (
    <AppShell
      title="VLSI Digital Circuit Simulator"
      subtitle="An interactive learning platform for digital logic — gates, multiplexers, flip-flops and more."
    >
      <div className="mb-8 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-secondary/40 p-6 md:p-10">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
            Version 2.0
          </span>
          <h2 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
            Build intuition for digital circuits, one bit at a time.
          </h2>
          <p className="mt-3 text-sm md:text-base text-muted-foreground">
            Toggle inputs, watch outputs glow, inspect truth tables, and study real
            sequential behaviour. Designed for students, hobbyists, and engineers.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/gates" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
              Start with Gates →
            </Link>
            <Link to="/learn" className="inline-flex items-center rounded-md border border-border bg-secondary/60 px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-secondary">
              Open Learning Center
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => (
          <Link key={m.to} to={m.to} className="group">
            <Card className="h-full transition-all group-hover:border-primary/60 group-hover:shadow-[0_0_30px_-12px_oklch(0.78_0.16_195/0.8)]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">{m.tag}</span>
                <span className="text-muted-foreground transition group-hover:text-primary">→</span>
              </div>
              <h3 className="mt-3 text-lg font-semibold">{m.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{m.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
