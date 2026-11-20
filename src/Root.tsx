import { Composition, Folder } from "remotion";
import { FinancialShort } from "./FinancialShort";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";
import sample from "../data/sample.json";
import type { VideoProps } from "./types";
import { EpisodeVideo } from "./scam/EpisodeVideo";
import { ep1 } from "./scam/ep1/episode";
import { ep2 } from "./scam/ep2/episode";
import { ep3 } from "./scam/ep3/episode";
import { ep4 } from "./scam/ep4/episode";
import { ep5 } from "./scam/ep5/episode";
import type { Episode, EpisodeProps } from "./scam/types";
import { CharSheet } from "./scam/CharSheet";
import { episodeFrames } from "./scam/timeline";

const episodes: Episode[] = [ep1, ep2, ep3, ep4, ep5];

// one stable component per episode
const components = Object.fromEntries(
  episodes.map((ep) => [ep.id, (p: EpisodeProps) => <EpisodeVideo {...p} ep={ep} />]),
);

const defaultEpisodeProps: EpisodeProps = {
  useVoice: true,
  useMusic: true,
  musicVolume: 0.5,
  sfxVolume: 0.3,
  showSubtitles: true,
};

export const RemotionRoot: React.FC = () => (
  <>
    <Folder name="ScamAlert">
      {episodes.map((ep) => (
        <Composition
          key={ep.id}
          id={ep.id}
          component={components[ep.id]}
          durationInFrames={episodeFrames(ep, FPS)}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={defaultEpisodeProps}
        />
      ))}
    </Folder>
    <Folder name="Dev">
      <Composition id="CharSheet" component={CharSheet} durationInFrames={30} fps={FPS} width={WIDTH} height={HEIGHT} />
    </Folder>
    <Composition
      id="FinancialShort"
      component={FinancialShort}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={sample as VideoProps}
    />
  </>
);
