import { AbsoluteFill, Series } from "remotion";
import { SCENES, theme } from "./theme";
import type { VideoProps } from "./types";
import { Hook } from "./scenes/Hook";
import { PriceChart } from "./scenes/PriceChart";
import { Stats } from "./scenes/Stats";
import { Takeaways } from "./scenes/Takeaways";
import { CallToAction } from "./scenes/CallToAction";

export const FinancialShort: React.FC<VideoProps> = (props) => (
  <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: theme.font, color: theme.text }}>
    <Series>
      <Series.Sequence durationInFrames={SCENES.hook}>
        <Hook {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.chart}>
        <PriceChart {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.stats}>
        <Stats {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.takeaways}>
        <Takeaways {...props} />
      </Series.Sequence>
      <Series.Sequence durationInFrames={SCENES.cta}>
        <CallToAction {...props} />
      </Series.Sequence>
    </Series>
    <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 60 }}>
      <div style={{ fontSize: 26, color: theme.muted }}>{props.disclaimer}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);
