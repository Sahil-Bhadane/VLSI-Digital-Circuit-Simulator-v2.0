import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell, Card } from "../components/AppShell";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Digital Logic Quiz — VLSI Sim" },
      { name: "description", content: "Test your understanding of logic gates, MUX/DEMUX and flip-flops." },
      { property: "og:title", content: "Digital Logic Quiz" },
      { property: "og:description", content: "Instant-feedback multiple choice quiz." },
    ],
  }),
  component: QuizPage,
});

type Q = { q: string; options: string[]; answer: number; explain: string };

const QUESTIONS: Q[] = [
  { q: "Which gate outputs 1 only when ALL inputs are 1?", options: ["OR", "AND", "XOR", "NOR"], answer: 1, explain: "AND requires every input to be HIGH." },
  { q: "NAND(1, 1) = ?", options: ["0", "1", "X", "Z"], answer: 0, explain: "AND(1,1)=1, inverted = 0." },
  { q: "An 8:1 MUX uses how many select lines?", options: ["2", "3", "4", "8"], answer: 1, explain: "log2(8) = 3 select lines." },
  { q: "Which flip-flop has a forbidden input state?", options: ["D", "JK", "T", "SR"], answer: 3, explain: "SR is invalid when S=R=1." },
  { q: "In a JK flip-flop, J=K=1 causes the output to…", options: ["Hold", "Reset", "Set", "Toggle"], answer: 3, explain: "J=K=1 toggles Q on each clock edge." },
  { q: "Which gates are universal?", options: ["AND & OR", "NAND & NOR", "XOR & XNOR", "NOT only"], answer: 1, explain: "Any boolean function can be built from NAND-only or NOR-only logic." },
  { q: "XOR(1, 1) = ?", options: ["0", "1", "X", "Undefined"], answer: 0, explain: "XOR is 1 only when inputs differ." },
  { q: "A D flip-flop's next Q equals…", options: ["Q", "D", "¬D", "¬Q"], answer: 1, explain: "On the clock edge, Q latches the value of D." },
];

function QuizPage() {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const total = QUESTIONS.length;
  const q = QUESTIONS[i];
  const correct = picked !== null && picked === q.answer;

  const progress = useMemo(() => Math.round((i / total) * 100), [i, total]);

  const next = () => {
    if (picked === null) return;
    if (picked === q.answer) setScore((s) => s + 1);
    if (i + 1 >= total) setDone(true);
    else {
      setI(i + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setI(0); setPicked(null); setScore(0); setDone(false);
  };

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <AppShell title="Quiz complete" subtitle="Review your performance and try again.">
        <Card className="text-center">
          <div className="text-5xl font-bold text-primary">{score}/{total}</div>
          <div className="mt-1 text-sm text-muted-foreground">{pct}% correct</div>
          <button onClick={restart} className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90">
            Restart quiz
          </button>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell title="Quiz" subtitle="Pick the best answer. You'll see instant feedback before moving on.">
      <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
      </div>
      <div className="mb-4 text-xs text-muted-foreground">Question {i + 1} of {total} · Score: {score}</div>

      <Card>
        <div className="text-lg font-semibold">{q.q}</div>
        <div className="mt-4 grid gap-2">
          {q.options.map((opt, idx) => {
            const isPicked = picked === idx;
            const isCorrect = picked !== null && idx === q.answer;
            const isWrong = isPicked && idx !== q.answer;
            return (
              <button
                key={idx}
                disabled={picked !== null}
                onClick={() => setPicked(idx)}
                className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${
                  isCorrect
                    ? "border-accent bg-accent/15 text-accent"
                    : isWrong
                    ? "border-destructive bg-destructive/15"
                    : isPicked
                    ? "border-primary bg-primary/10"
                    : "border-border/60 bg-secondary/40 hover:border-primary/40"
                }`}
              >
                <span>{opt}</span>
                {isCorrect && <span>✓</span>}
                {isWrong && <span>✕</span>}
              </button>
            );
          })}
        </div>

        {picked !== null && (
          <div className={`mt-4 rounded-md border p-3 text-sm ${correct ? "border-accent/40 bg-accent/10" : "border-destructive/40 bg-destructive/10"}`}>
            <div className="font-semibold">{correct ? "Correct!" : "Not quite."}</div>
            <div className="mt-1 text-muted-foreground">{q.explain}</div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={next}
            disabled={picked === null}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition disabled:opacity-40 hover:opacity-90"
          >
            {i + 1 >= total ? "Finish" : "Next"}
          </button>
        </div>
      </Card>
    </AppShell>
  );
}