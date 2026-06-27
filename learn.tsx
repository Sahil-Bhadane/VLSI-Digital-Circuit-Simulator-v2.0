import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Card } from "../components/AppShell";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learning Center — VLSI Sim" },
      { name: "description", content: "Concise theory cards on boolean algebra, combinational and sequential digital design." },
      { property: "og:title", content: "Learning Center" },
      { property: "og:description", content: "Theory behind every simulator module." },
    ],
  }),
  component: LearnPage,
});

const TOPICS = [
  {
    title: "Boolean Algebra Basics",
    body: [
      "Digital systems use two values: 0 (LOW) and 1 (HIGH).",
      "Three fundamental operations: AND (·), OR (+), and NOT (¬).",
      "Identities: A + 0 = A, A · 1 = A, A + A̅ = 1, A · A̅ = 0.",
    ],
  },
  {
    title: "Universal Gates",
    body: [
      "NAND and NOR are universal — any boolean function can be built from either alone.",
      "NOT from NAND: NAND(A,A) = A̅.",
      "AND from NAND: NAND(NAND(A,B), NAND(A,B)).",
    ],
  },
  {
    title: "Multiplexers",
    body: [
      "A 2ⁿ:1 MUX uses n select lines to route one of 2ⁿ inputs to a single output.",
      "Used for data routing, parallel-to-serial conversion, and implementing arbitrary boolean functions.",
    ],
  },
  {
    title: "Demultiplexers",
    body: [
      "A 1:2ⁿ DEMUX routes a single input to one of 2ⁿ outputs selected by n control lines.",
      "Used for address decoding and serial-to-parallel conversion.",
    ],
  },
  {
    title: "Latches vs Flip-Flops",
    body: [
      "A latch is level-sensitive — the output follows inputs while the enable is asserted.",
      "A flip-flop is edge-triggered — the output updates only on a rising or falling clock edge.",
      "Flip-flops are the building blocks of registers, counters, and state machines.",
    ],
  },
  {
    title: "JK Flip-Flop",
    body: [
      "Resolves the invalid S=R=1 condition of the SR flip-flop by toggling.",
      "J=K=0 → hold, J=1,K=0 → set, J=0,K=1 → reset, J=K=1 → toggle.",
    ],
  },
] as const;

function LearnPage() {
  return (
    <AppShell title="Learning Center" subtitle="Bite-sized theory cards covering the building blocks of digital design.">
      <div className="grid gap-4 md:grid-cols-2">
        {TOPICS.map((t) => (
          <Card key={t.title}>
            <h3 className="text-lg font-semibold text-primary">{t.title}</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {t.body.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}