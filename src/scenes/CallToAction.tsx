import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import type { VideoProps } from "../types";
import { TickerBadge, usePop } from "./common";

export const CallToAction: React.FC<VideoProps> = ({ cta, ticker }) => {
  const p = usePop();
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, textAlign: "center" }}>
      <TickerBadge ticker={ticker} />
      <div style={{ marginTop: 70, fontSize: 96, fontWeight: 900, lineHeight: 1.15, transform: `scale(${p})` }}>
        {cta}
      </div>
      <div style={{ marginTop: 50, fontSize: 120, color: theme.accent, transform: `scale(${p})` }}>↓</div>
    </AbsoluteFill>
  );
};
