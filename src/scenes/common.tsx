import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "../theme";

export const usePop = (delay = 0) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14 } });
};

export const SceneTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const p = usePop();
  return (
    <div
      style={{
        fontSize: 64,
        fontWeight: 800,
        textTransform: "uppercase",
        letterSpacing: 2,
        color: theme.accent,
        opacity: p,
        transform: `translateY(${interpolate(p, [0, 1], [40, 0])}px)`,
        marginBottom: 60,
      }}
    >
      {children}
    </div>
  );
};

export const TickerBadge: React.FC<{ ticker: string }> = ({ ticker }) => (
  <div
    style={{
      display: "inline-block",
      padding: "14px 36px",
      borderRadius: 999,
      background: theme.panel,
      border: `3px solid ${theme.border}`,
      fontSize: 48,
      fontWeight: 800,
      letterSpacing: 4,
    }}
  >
    ${ticker}
  </div>
);
