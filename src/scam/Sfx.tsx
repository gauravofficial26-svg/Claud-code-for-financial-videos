import { createContext, useContext } from "react";
import { Audio, Sequence, staticFile } from "remotion";

export type SfxName = "ping" | "buzz" | "knock" | "slam" | "whoosh" | "pop";

export const SfxLevel = createContext(0.3);

/** Play a sound effect at a frame relative to the current scene (kept low under the voice) */
export const Sfx: React.FC<{ name: SfxName; at: number; volume?: number }> = ({ name, at, volume = 1 }) => {
  const level = useContext(SfxLevel);
  return (
    <Sequence from={Math.max(0, Math.round(at))} layout="none">
      <Audio src={staticFile(`sfx/${name}.wav`)} volume={volume * level} />
    </Sequence>
  );
};
