import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, BitChip, Card, ToggleBit } from "../components/AppShell";
import { GATES, type GateKind, type Bit, truthTable } from "../lib/logic";

export const Route = createFileRoute("/gates")({
  head: () => ({
    meta: [
      { title: "Logic Gates Simulator — VLSI Sim" },
      { name: "description", content: "Interactive simulator for AND, OR, NOT, NAND, NOR, XOR, XNOR with live truth tables." },
      { property: "og:title", content: "Logic Gates Simulator" },
      { property: "og:description", content: "Toggle inputs and see outputs update instantly." },
    ],
  }),
  component: GatesPage,
});

const KINDS: GateKind[] = ["AND", "OR", "NOT", "NAND", "NOR", "XOR", "XNOR", "BUF"];

function GatesPage() {
  const [kind, setKind] = useState<GateKind>("AND");
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);

  const gate = GATES[kind];
  const out = useMemo<Bit>(() => (gate.arity === 1 ? gate.fn(a) : gate.fn(a, b)), [gate, a, b]);
  const table = useMemo(() => truthTable(kind), [kind]);

  return (
    <AppShell
      title="Logic Gates"
      subtitle="Pick a gate, toggle the inputs, and watch the output."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-md border px-3 py-1.5 text-sm font-mono transition ${
              kind === k
                ? "border-primary bg-primary/15 text-primary"
                : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Gate</div>
              <div className="text-xl font-bold">{kind}</div>
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              Y = {gate.arity === 1 ? gate.expr("A") : gate.expr("A", "B")}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6">
            <div className="flex flex-col gap-3">
              <ToggleBit value={a} onChange={setA} label="A" />
              {gate.arity === 2 && <ToggleBit value={b} onChange={setB} label="B" />}
            </div>

            <GateSvg kind={kind} />

            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-muted-foreground">Y =</span>
              <BitChip value={out} />
            </div>
          </div>

          <p className="mt-6 text-sm text-muted-foreground">{gate.description}</p>
        </Card>

        <Card>
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Truth table</div>
            <div className="text-xs text-muted-foreground">{table.length} rows</div>
          </div>
          <table className="w-full text-sm font-mono">
            <thead>
              <tr className="text-muted-foreground">
                <th className="py-1.5 text-left">A</th>
                {gate.arity === 2 && <th className="py-1.5 text-left">B</th>}
                <th className="py-1.5 text-left">Y</th>
              </tr>
            </thead>
            <tbody>
              {table.map((row, i) => {
                const active = row.inputs[0] === a && (gate.arity === 1 || row.inputs[1] === b);
                return (
                  <tr key={i} className={`border-t border-border/40 ${active ? "bg-primary/10" : ""}`}>
                    <td className="py-1.5">{row.inputs[0]}</td>
                    {gate.arity === 2 && <td className="py-1.5">{row.inputs[1]}</td>}
                    <td className="py-1.5 font-bold text-primary">{row.out}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>
      </div>
    </AppShell>
  );
}

function GateSvg({ kind }: { kind: GateKind }) {
  return (
    <div className="grid place-items-center">
      <div className="rounded-lg border border-border/60 bg-background px-6 py-4 font-mono text-2xl font-bold text-primary shadow-inner">
        {kind}
      </div>
    </div>
  );
}