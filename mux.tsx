import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, BitChip, Card, ToggleBit } from "../components/AppShell";
import { mux, demux, type Bit } from "../lib/logic";

export const Route = createFileRoute("/mux")({
  head: () => ({
    meta: [
      { title: "MUX / DEMUX Simulator — VLSI Sim" },
      { name: "description", content: "Simulate 2:1, 4:1, 8:1 multiplexers and 1:2, 1:4, 1:8 demultiplexers." },
      { property: "og:title", content: "MUX / DEMUX Simulator" },
      { property: "og:description", content: "Live multiplexer and demultiplexer behaviour." },
    ],
  }),
  component: MuxPage,
});

type Mode = "MUX" | "DEMUX";
const WIDTHS = [1, 2, 3] as const; // select-line counts → 2/4/8

function MuxPage() {
  const [mode, setMode] = useState<Mode>("MUX");
  const [selBits, setSelBits] = useState<1 | 2 | 3>(2);
  const n = 1 << selBits;
  const [selects, setSelects] = useState<Bit[]>(() => Array(3).fill(0) as Bit[]);
  const [inputs, setInputs] = useState<Bit[]>(() => Array(8).fill(0) as Bit[]);
  const [demuxIn, setDemuxIn] = useState<Bit>(1);

  const sel = selects.slice(0, selBits);
  const muxOut = useMemo<Bit>(() => mux(sel, inputs.slice(0, n)), [sel, inputs, n]);
  const demuxOut = useMemo<Bit[]>(() => demux(sel, demuxIn), [sel, demuxIn]);

  const setSelect = (i: number, v: Bit) => setSelects((s) => s.map((x, idx) => (idx === i ? v : x)) as Bit[]);
  const setInput = (i: number, v: Bit) => setInputs((s) => s.map((x, idx) => (idx === i ? v : x)) as Bit[]);

  const selIndex = sel.reduce<number>((acc, s, i) => acc | (s << (sel.length - 1 - i)), 0);

  return (
    <AppShell title="MUX / DEMUX" subtitle="Multiplexer and demultiplexer with selectable widths.">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-md border border-border/60 p-1">
          {(["MUX", "DEMUX"] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-3 py-1 text-sm font-semibold transition ${
                mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
        <div className="inline-flex rounded-md border border-border/60 p-1">
          {WIDTHS.map((w) => (
            <button
              key={w}
              onClick={() => setSelBits(w)}
              className={`rounded px-3 py-1 text-sm font-mono transition ${
                selBits === w ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {mode === "MUX" ? `${1 << w}:1` : `1:${1 << w}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-3 text-sm font-semibold">Select lines</div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: selBits }).map((_, i) => (
              <ToggleBit key={i} value={sel[i] ?? 0} onChange={(v) => setSelect(i, v)} label={`S${selBits - 1 - i}`} />
            ))}
          </div>
          <div className="mt-3 text-xs font-mono text-muted-foreground">
            Selected index: <span className="text-primary">{selIndex}</span>
          </div>
        </Card>

        {mode === "MUX" ? (
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold">Data inputs (I0 … I{n - 1})</div>
              <div className="text-xs text-muted-foreground">Output Y = I{selIndex}</div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: n }).map((_, i) => (
                <div key={i} className={`rounded-md border p-1 transition ${i === selIndex ? "border-primary/80 bg-primary/5" : "border-border/40"}`}>
                  <ToggleBit value={inputs[i] ?? 0} onChange={(v) => setInput(i, v)} label={`I${i}`} />
                </div>
              ))}
            </div>
            <div className="mt-5 flex items-center gap-3 border-t border-border/40 pt-4">
              <span className="font-mono text-xs text-muted-foreground">Y =</span>
              <BitChip value={muxOut} />
            </div>
          </Card>
        ) : (
          <Card>
            <div className="mb-3 text-sm font-semibold">Data input</div>
            <ToggleBit value={demuxIn} onChange={setDemuxIn} label="D" />
            <div className="mt-5 border-t border-border/40 pt-4">
              <div className="mb-2 text-sm font-semibold">Outputs</div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {demuxOut.map((v, i) => (
                  <div key={i} className={`flex flex-col items-center gap-1 rounded-md border p-2 ${i === selIndex ? "border-primary/80 bg-primary/5" : "border-border/40"}`}>
                    <span className="font-mono text-[10px] text-muted-foreground">Y{i}</span>
                    <BitChip value={v} />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
      </div>
    </AppShell>
  );
}