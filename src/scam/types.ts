import type React from "react";

export type SceneDef = {
  id: string;
  voiceover: string;
  /** optional big headline over the scene */
  onScreen?: string;
  /** dur = scene length in frames */
  Visual: React.FC<{ dur: number }>;
};

export type VoiceMeta = { files: string[]; durations: number[] };

export type Episode = {
  id: string;
  number: number;
  title: string;
  scenes: SceneDef[];
  caption: string;
  source: string;
  voice?: VoiceMeta;
};

export type EpisodeProps = {
  /** play the generated per-scene voice clips */
  useVoice: boolean;
  /** background music inside /public, or null */
  music: string | null;
  musicVolume: number;
  showSubtitles: boolean;
};
