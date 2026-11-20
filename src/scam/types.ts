import type React from "react";

export type SceneDef = {
  /** start and end in seconds, as in the script */
  from: number;
  to: number;
  voiceover: string;
  /** big headline text; omit when the visual already shows it */
  onScreen?: string;
  Visual: React.FC;
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  scenes: SceneDef[];
  caption: string;
  source: string;
};

export type EpisodeProps = {
  /** path inside /public, e.g. "audio/ep1.mp3"; null = silent */
  voiceover: string | null;
  /** optional background music inside /public */
  music: string | null;
  musicVolume: number;
  showSubtitles: boolean;
};
