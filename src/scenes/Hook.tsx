import { AbsoluteFill, interpolate } from "remotion";
import type { VideoProps } from "../types";
import { TickerBadge, usePop } from "./common";

export const Hook: React.FC<VideoProps> = ({ hook, ticker, companyName }) => {
  const badge = usePop(0);
  const text = usePop(8);
  return (
    <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: 90, textAlign: "center" }}>
      <div style={{ transform: `scale(${badge})` }}>
        <TickerBadge ticker={ticker} />
      </div>
      <div
        style={{
          marginTop: 70,
          fontSize: 104,
          fontWeight: 900,
          lineHeight: 1.1,
          opacity: text,
          transform: `translateY(${interpolate(text, [0, 1], [60, 0])}px)`,
        }}
      >
        {hook}
      </div>
      <div style={{ marginTop: 40, fontSize: 40, opacity: text * 0.7 }}>{companyName}</div>
    </AbsoluteFill>
  );
};
