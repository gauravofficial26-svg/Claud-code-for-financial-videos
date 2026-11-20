import { Audio, Sequence, staticFile } from "remotion";

export type SfxName = "ping" | "buzz" | "knock" | "slam" | "whoosh" | "pop";

/** Play a sound effect at a frame relative to the current scene */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume = 1 }) => (
  <Sequence from={Math.max(0, Math.round(at))} layout="none">
    <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume} />
  </Sequence>
);
