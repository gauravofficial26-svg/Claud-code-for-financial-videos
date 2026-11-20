import { useCurrentFrame, useVideoConfig } from "remotion";
import { C } from "./theme";

/** Split a voiceover line into short caption chunks (~32 chars). */
export const chunk = (text: string, max = 32): string[] => {
  const parts = text.split(/(?<=[,।?!])\s+/);
  const out: string[] = [];
  for (const part of parts) {
    const words = part.split(" ");
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > max && cur) {
        out.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) out.push(cur);
  }
  // merge very short tails into previous chunk
  return out.reduce<string[]>((acc, c) => {
    if (acc.length && c.length < 8) acc[acc.length - 1] += " " + c;
    else acc.push(c);
    return acc;
  }, []);
};

/** Shows the voiceover chunk for the current moment, timed by text length. */
export const Subtitles: React.FC<{ text: string; durationInFrames: number }> = ({ text, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chunks = chunk(text);
  const usable = durationInFrames - Math.round(fps * 0.45);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  let acc = 0;
  let current = chunks[chunks.length - 1];
  for (const c of chunks) {
    const end = ((acc + c.length) / total) * usable;
    if (frame < end) {
      current = c;
      break;
    }
    acc += c.length;
  }
  return (
    <div
      style={{
        position: "absolute",
        left: 90,
        right: 150,
        top: 1470,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "rgba(0,0,0,0.72)",
          border: `2px solid ${C.border}`,
          borderRadius: 24,
          padding: "14px 30px",
          fontSize: 50,
          fontWeight: 700,
          lineHeight: 1.35,
          textAlign: "center",
          color: C.text,
        }}
      >
        {current}
      </div>
    </div>
  );
};
