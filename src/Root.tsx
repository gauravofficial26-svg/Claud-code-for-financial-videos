import { Composition } from "remotion";
import { FinancialShort } from "./FinancialShort";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";
import sample from "../data/sample.json";
import type { VideoProps } from "./types";

export const RemotionRoot: React.FC = () => (
  <Composition
    id="FinancialShort"
    component={FinancialShort}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={sample as VideoProps}
  />
);
