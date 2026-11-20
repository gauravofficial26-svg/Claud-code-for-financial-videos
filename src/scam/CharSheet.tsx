import { AbsoluteFill } from "remotion";
import { LOOKS, Person, type Arm, type Expr } from "./characters";

const rows: [string, Expr, Arm][] = [
  ["rahul", "happy", "phone"], ["rahul", "shock", "cheek"], ["rahul", "sad", "down"], ["granny", "sad", "phone"],
  ["scammer", "evil", "cross"], ["police", "stern", "cross"], ["friend1", "happy", "wave"], ["dad", "neutral", "down"], ["mom", "happy", "down"],
];

/** Dev-only: all characters on one frame */
export const CharSheet: React.FC = () => (
  <AbsoluteFill style={{ background: "#1E2A47", flexDirection: "row", flexWrap: "wrap", padding: 20, gap: 10 }}>
    {rows.map(([k, e, a], i) => (
      <Person key={i} look={LOOKS[k]} expr={e} arm={a} width={330} seed={i} />
    ))}
  </AbsoluteFill>
);
