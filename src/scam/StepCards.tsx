import { interpolate, useCurrentFrame } from "remotion";
import { usePop } from "./anim";
import { Stage } from "./Stage";
import { C } from "./theme";

const Card: React.FC<{ n: number; text: string; delay: number; highlight?: boolean }> = ({ n, text, delay, highlight }) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        width: 880,
        display: "flex",
        alignItems: "center",
        gap: 36,
        background: C.panel,
        border: `4px solid ${highlight ? C.green : C.border}`,
        borderRadius: 32,
        padding: "34px 40px",
        marginBottom: 36,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-200, 0])}px)`,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 110,
          height: 110,
          borderRadius: 999,
          background: C.green,
          color: C.bg,
          fontSize: 66,
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 62, fontWeight: 800, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};

/** "Three step cards appear one by one" – shared by every episode. */
export const StepCards: React.FC<{ title: string; steps: string[]; gap?: number }> = ({ title, steps, gap = 40 }) => {
  const frame = useCurrentFrame();
  return (
    <Stage style={{ height: 1000 }}>
      <div style={{ fontSize: 60, fontWeight: 800, color: C.green, marginBottom: 44, opacity: Math.min(1, frame / 8) }}>
        {title}
      </div>
      {steps.map((s, i) => (
        <Card key={s} n={i + 1} text={s} delay={8 + i * gap} highlight={i === steps.length - 1} />
      ))}
    </Stage>
  );
};
