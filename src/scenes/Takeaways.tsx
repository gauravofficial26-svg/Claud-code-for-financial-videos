import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import type { VideoProps } from "../types";
import { SceneTitle, usePop } from "./common";

const Item: React.FC<{ text: string; n: number; delay: number }> = ({ text, n, delay }) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 40,
        marginBottom: 64,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [50, 0])}px)`,
      }}
    >
      <div
        style={{
          flex: "0 0 auto",
          width: 110,
          height: 110,
          borderRadius: 999,
          background: theme.accent,
          color: theme.bg,
          fontSize: 60,
          fontWeight: 900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {n}
      </div>
      <div style={{ fontSize: 64, fontWeight: 700, lineHeight: 1.2 }}>{text}</div>
    </div>
  );
};

export const Takeaways: React.FC<VideoProps> = ({ takeaways }) => (
  <AbsoluteFill style={{ padding: 90, paddingTop: 300 }}>
    <SceneTitle>Takeaways</SceneTitle>
    {takeaways.map((t, i) => (
      <Item key={t} text={t} n={i + 1} delay={10 + i * 20} />
    ))}
  </AbsoluteFill>
);
