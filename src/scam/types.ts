import type React from "react";

export type Speaker = "narrator" | "rahul" | "scammer" | "police" | "granny";
export type Line = { who: Speaker; text: string };

/** A spoken line placed on the scene's local timeline (frames) */
export type Cue = Line & { from: number; to: number; file?: string };

export type SceneProps = { dur: number; cues: Cue[] };

export type SceneDef = {
  id: string;
  lines: Line[];
  onScreen?: string;
  Visual: React.FC<SceneProps>;
};

export type VoiceMeta = {
  total: number;
  scenes: { id: string; mood: string; start: number; dur: number; lines: { who: string; text: string; file: string; start: number; dur: number }[] }[];
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  scenes: SceneDef[];
  caption: string;
  source: string;
  voice?: VoiceMeta;
  music?: string;
};

export type EpisodeProps = {
  useVoice: boolean;
  useMusic: boolean;
  /** music level between lines; it ducks under speech automatically */
  musicVolume: number;
  sfxVolume: number;
  showSubtitles: boolean;
};
