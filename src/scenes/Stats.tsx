import { AbsoluteFill, interpolate } from "remotion";
import { theme } from "../theme";
import type { VideoProps } from "../types";
import { SceneTitle, usePop } from "./common";

const StatCard: React.FC<{ label: string; value: string; delay: number }> = ({ label, value, delay }) => {
  const p = usePop(delay);
  return (
    <div
      style={{
        background: theme.panel,
        border: `3px solid ${theme.border}`,
        borderRadius: 36,
        padding: "48px 56px",
        marginBottom: 40,
        opacity: p,
        transform: `translateX(${interpolate(p, [0, 1], [-120, 0])}px)`,
      }}
    >
      <div style={{ fontSize: 40, color: theme.muted, marginBottom: 12 }}>{label}</div>
      <div style={{ fontSize: 96, fontWeight: 900 }}>{value}</div>
    </div>
  );
};

export const Stats: React.FC<VideoProps> = ({ stats }) => (
  <AbsoluteFill style={{ padding: 90, paddingTop: 260 }}>
    <SceneTitle>Key numbers</SceneTitle>
    {stats.map((s, i) => (
      <StatCard key={s.label} {...s} delay={10 + i * 12} />
    ))}
  </AbsoluteFill>
);
