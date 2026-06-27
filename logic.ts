// Core boolean logic primitives used across all simulator modules.
export type Bit = 0 | 1;

export const AND = (a: Bit, b: Bit): Bit => (a && b ? 1 : 0);
export const OR = (a: Bit, b: Bit): Bit => (a || b ? 1 : 0);
export const NOT = (a: Bit): Bit => (a ? 0 : 1);
export const NAND = (a: Bit, b: Bit): Bit => NOT(AND(a, b));
export const NOR = (a: Bit, b: Bit): Bit => NOT(OR(a, b));
export const XOR = (a: Bit, b: Bit): Bit => ((a ^ b) as Bit);
export const XNOR = (a: Bit, b: Bit): Bit => NOT(XOR(a, b));
export const BUF = (a: Bit): Bit => a;

export type GateKind =
  | "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR" | "XNOR" | "BUF";

export const GATES: Record<GateKind, {
  arity: 1 | 2;
  fn: (a: Bit, b?: Bit) => Bit;
  symbol: string;
  expr: (a: string, b?: string) => string;
  description: string;
}> = {
  AND:  { arity: 2, fn: (a, b) => AND(a, b ?? 0), symbol: "·", expr: (a, b) => `${a} · ${b}`, description: "Output is 1 only when ALL inputs are 1." },
  OR:   { arity: 2, fn: (a, b) => OR(a, b ?? 0), symbol: "+", expr: (a, b) => `${a} + ${b}`, description: "Output is 1 when ANY input is 1." },
  NOT:  { arity: 1, fn: (a) => NOT(a), symbol: "¬", expr: (a) => `¬${a}`, description: "Inverts the single input." },
  NAND: { arity: 2, fn: (a, b) => NAND(a, b ?? 0), symbol: "↑", expr: (a, b) => `¬(${a} · ${b})`, description: "NOT AND — universal gate." },
  NOR:  { arity: 2, fn: (a, b) => NOR(a, b ?? 0), symbol: "↓", expr: (a, b) => `¬(${a} + ${b})`, description: "NOT OR — universal gate." },
  XOR:  { arity: 2, fn: (a, b) => XOR(a, b ?? 0), symbol: "⊕", expr: (a, b) => `${a} ⊕ ${b}`, description: "Output is 1 when inputs differ." },
  XNOR: { arity: 2, fn: (a, b) => XNOR(a, b ?? 0), symbol: "⊙", expr: (a, b) => `¬(${a} ⊕ ${b})`, description: "Output is 1 when inputs are equal." },
  BUF:  { arity: 1, fn: (a) => BUF(a), symbol: "▷", expr: (a) => `${a}`, description: "Buffer — passes the input unchanged." },
};

export function truthTable(kind: GateKind): { inputs: Bit[]; out: Bit }[] {
  const arity = GATES[kind].arity;
  const rows = 1 << arity;
  const out: { inputs: Bit[]; out: Bit }[] = [];
  for (let i = 0; i < rows; i++) {
    const a = ((i >> (arity - 1)) & 1) as Bit;
    const b = arity === 2 ? ((i & 1) as Bit) : undefined;
    const inputs = arity === 2 ? [a, b as Bit] : [a];
    out.push({ inputs, out: GATES[kind].fn(a, b) });
  }
  return out;
}

// MUX / DEMUX
export function mux(selects: Bit[], inputs: Bit[]): Bit {
  const idx = selects.reduce<number>((acc, s, i) => acc | (s << (selects.length - 1 - i)), 0);
  return (inputs[idx] ?? 0) as Bit;
}

export function demux(selects: Bit[], input: Bit): Bit[] {
  const n = 1 << selects.length;
  const idx = selects.reduce<number>((acc, s, i) => acc | (s << (selects.length - 1 - i)), 0);
  const out = new Array<Bit>(n).fill(0);
  out[idx] = input;
  return out;
}

// Flip-flops (next-state functions)
export const ffSR = (S: Bit, R: Bit, Q: Bit): { Q: Bit; invalid: boolean } => {
  if (S === 1 && R === 1) return { Q, invalid: true };
  if (S === 1) return { Q: 1, invalid: false };
  if (R === 1) return { Q: 0, invalid: false };
  return { Q, invalid: false };
};
export const ffD = (D: Bit): Bit => D;
export const ffJK = (J: Bit, K: Bit, Q: Bit): Bit => {
  if (J === 0 && K === 0) return Q;
  if (J === 1 && K === 0) return 1;
  if (J === 0 && K === 1) return 0;
  return NOT(Q);
};
export const ffT = (T: Bit, Q: Bit): Bit => (T ? NOT(Q) : Q);