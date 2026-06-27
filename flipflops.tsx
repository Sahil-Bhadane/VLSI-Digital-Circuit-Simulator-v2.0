import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppShell, BitChip, Card, ToggleBit } from "../components/AppShell";
import { ffD, ffJK, ffSR, ffT, NOT, type Bit } from "../lib/logic";

export const Route = createFileRoute("/flipflops")({
  head: () => ({
    meta: [
      { title: "Flip-Flops Simulator — VLSI Sim" },
      { name: "description", content: "Simulate SR, D, JK, and T flip-flops with rising-edge triggered clock." },
      { property: "og:title", content: "Flip-Flops Simulator" },
      { property: "og:description", content: "Sequential logic with live waveform and clock control." },
    ],
  }),
  component: FFPage,
});

type Kind = "SR" | "D" | "JK" | "T";
const KINDS: Kind[] = ["SR", "D", "JK", "T"];

function FFPage() {
  const [kind, setKind] = useState<Kind>("D");
  const [Q, setQ] = useState<Bit>(0);
  const [invalid, setInvalid] = useState(false);
  const [history, setHistory] = useState<Bit[]>([0]);

  // inputs
  const [S, setS] = useState<Bit>(0);
  const [R, setR] = useState<Bit>(0);
  const [D, setD] = useState<Bit>(0);
  const [J, setJ] = useState<Bit>(0);
  const [K, setK] = useState<Bit>(0);
  const [T, setT] = useState<Bit>(0);

  const [autoClock, setAutoClock] = useState(false);
  const [clk, setClk] = useState<Bit>(0);
  const lastClk = useRef<Bit>(0);

  const tick = () => setClk((c) => (c ? 0 : 1) as Bit);

  // Auto clock
  useEffect(() => {
    if (!autoClock) return;
    const id = setInterval(tick, 700);
    return () => clearInterval(id);
  }, [autoClock]);

  // Rising-edge trigger
  useEffect(() => {
    if (lastClk.current === 0 && clk === 1) {
      let nextQ: Bit = Q;
      let nextInvalid = false;
      if (kind === "SR") {
        const r = ffSR(S, R, Q);
        nextQ = r.Q;
        nextInvalid = r.invalid;
      } else if (kind === "D") nextQ = ffD(D);
      else if (kind === "JK") nextQ = ffJK(J, K, Q);
      else if (kind === "T") nextQ = ffT(T, Q);
      setQ(nextQ);
      setInvalid(nextInvalid);
      setHistory((h) => [...h.slice(-31), nextQ]);
    }
    lastClk.current = clk;
  }, [clk, kind, S, R, D, J, K, T, Q]);

  const reset = () => {
    setQ(0);
    setInvalid(false);
    setHistory([0]);
  };

  return (
    <AppShell title="Flip-Flops" subtitle="Edge-triggered sequential elements. Outputs update on the rising clock edge.">
      <div className="mb-6 flex flex-wrap gap-2">
        {KINDS.map((k) => (
          <button
            key={k}
            onClick={() => { setKind(k); reset(); }}
            className={`rounded-md border px-3 py-1.5 text-sm font-mono transition ${
              kind === k ? "border-primary bg-primary/15 text-primary" : "border-border/60 bg-secondary/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}-FF
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Flip-Flop</div>
              <div className="text-xl font-bold">{kind}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={tick} className="rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90">
                Pulse CLK
              </button>
              <button
                onClick={() => setAutoClock((x) => !x)}
                className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition ${
                  autoClock ? "border-accent bg-accent/15 text-accent" : "border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                {autoClock ? "Stop" : "Auto"}
              </button>
              <button onClick={reset} className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
                Reset
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-2 text-sm font-semibold">Inputs</div>
              <div className="flex flex-wrap gap-2">
                {kind === "SR" && (
                  <>
                    <ToggleBit value={S} onChange={setS} label="S" />
                    <ToggleBit value={R} onChange={setR} label="R" />
                  </>
                )}
                {kind === "D" && <ToggleBit value={D} onChange={setD} label="D" />}
                {kind === "JK" && (
                  <>
                    <ToggleBit value={J} onChange={setJ} label="J" />
                    <ToggleBit value={K} onChange={setK} label="K" />
                  </>
                )}
                {kind === "T" && <ToggleBit value={T} onChange={setT} label="T" />}
              </div>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span>CLK</span>
                <span className={`inline-block h-2 w-10 rounded-full transition ${clk ? "bg-primary shadow-[0_0_12px_-2px_oklch(0.78_0.16_195/0.9)]" : "bg-secondary"}`} />
              </div>
            </div>

            <div>
              <div className="mb-2 text-sm font-semibold">Outputs</div>
              <div className="flex flex-wrap items-center gap-3">
                <BitChip value={Q} label="Q" />
                <BitChip value={NOT(Q)} label="Q̄" />
              </div>
              {invalid && (
                <div className="mt-3 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive-foreground">
                  Invalid state: S=R=1 in an SR flip-flop is forbidden.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <div className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">Q waveform</div>
            <div className="flex h-12 items-end gap-0.5 overflow-hidden rounded-md border border-border/40 bg-background p-1">
              {history.map((b, i) => (
                <div key={i} className={`w-2 ${b ? "h-full bg-primary" : "h-1 bg-muted"}`} />
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 text-sm font-semibold">Characteristic table</div>
          <CharTable kind={kind} />
        </Card>
      </div>
    </AppShell>
  );
}

function CharTable({ kind }: { kind: Kind }) {
  const rows: { label: string; q: string }[] =
    kind === "SR"
      ? [
          { label: "S=0, R=0", q: "Q (hold)" },
          { label: "S=0, R=1", q: "0 (reset)" },
          { label: "S=1, R=0", q: "1 (set)" },
          { label: "S=1, R=1", q: "invalid" },
        ]
      : kind === "D"
      ? [
          { label: "D=0", q: "0" },
          { label: "D=1", q: "1" },
        ]
      : kind === "JK"
      ? [
          { label: "J=0, K=0", q: "Q (hold)" },
          { label: "J=0, K=1", q: "0 (reset)" },
          { label: "J=1, K=0", q: "1 (set)" },
          { label: "J=1, K=1", q: "Q̄ (toggle)" },
        ]
      : [
          { label: "T=0", q: "Q (hold)" },
          { label: "T=1", q: "Q̄ (toggle)" },
        ];
  return (
    <table className="w-full text-sm font-mono">
      <thead>
        <tr className="text-muted-foreground">
          <th className="py-1.5 text-left">Inputs</th>
          <th className="py-1.5 text-left">Q(next)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-t border-border/40">
            <td className="py-1.5">{r.label}</td>
            <td className="py-1.5 text-primary">{r.q}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}