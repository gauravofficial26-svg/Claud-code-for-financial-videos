import { Composition, Folder } from "remotion";
import { FinancialShort } from "./FinancialShort";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./theme";
import sample from "../data/sample.json";
import type { VideoProps } from "./types";
import { EpisodeVideo } from "./scam/EpisodeVideo";
import { ep1 } from "./scam/ep1/episode";
import type { Episode, EpisodeProps } from "./scam/types";

const episodes: Episode[] = [ep1];

// one stable component per episode
const components = Object.fromEntries(
  episodes.map((ep) => [ep.id, (p: EpisodeProps) => <EpisodeVideo {...p} ep={ep} />]),
);

const defaultEpisodeProps: EpisodeProps = {
  voiceover: null,
  music: null,
  musicVolume: 0.12,
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
          durationInFrames={Math.round(ep.scenes[ep.scenes.length - 1].to * FPS)}
          fps={FPS}
          width={WIDTH}
          height={HEIGHT}
          defaultProps={defaultEpisodeProps}
        />
      ))}
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
