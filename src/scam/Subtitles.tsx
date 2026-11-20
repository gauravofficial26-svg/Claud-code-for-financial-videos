import { useCurrentFrame } from "remotion";
import { C } from "./theme";
import type { Cue, Speaker } from "./types";

/** Split a line into short caption chunks (~30 chars). */
export const chunk = (text: string, max = 30): string[] => {
  const out: string[] = [];
  for (const part of text.split(/(?<=[,।?!])\s+/)) {
    let cur = "";
    for (const w of part.split(" ")) {
      if ((cur + " " + w).trim().length > max && cur) {
        out.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) out.push(cur);
  }
  return out.reduce<string[]>((acc, c) => {
    if (acc.length && c.length < 8) acc[acc.length - 1] += " " + c;
    else acc.push(c);
    return acc;
  }, []);
};

export const SPEAKER_TAG: Record<Speaker, { name: string; color: string } | null> = {
  narrator: null,
  rahul: { name: "राहुल", color: "#60A5FA" },
  scammer: { name: "ठग", color: "#F87171" },
  police: { name: "पुलिस", color: "#E5C068" },
  granny: { name: "दादी", color: "#F9A8D4" },
};

export const Subtitles: React.FC<{ cues: Cue[] }> = ({ cues }) => {
  const frame = useCurrentFrame();
  // active cue, or the last one that started (hold briefly through gaps)
  const cue = [...cues].reverse().find((c) => frame >= c.from - 2 && frame < c.to + 8);
  if (!cue) return null;
  const chunks = chunk(cue.text);
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const len = cue.to - cue.from;
  let acc = 0;
  let current = chunks[chunks.length - 1];
  for (const c of chunks) {
    if (frame - cue.from < ((acc + c.length) / total) * len) {
      current = c;
      break;
    }
    acc += c.length;
  }
  const tag = SPEAKER_TAG[cue.who];
  return (
    <div style={{ position: "absolute", left: 80, right: 140, top: 1460, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {tag && (
        <div style={{ background: tag.color, color: C.bg, fontSize: 32, fontWeight: 800, padding: "2px 18px", borderRadius: 10, marginBottom: -6, zIndex: 1 }}>{tag.name}</div>
      )}
      <div style={{ background: "rgba(0,0,0,0.75)", border: `3px solid ${tag ? tag.color : C.border}`, borderRadius: 24, padding: "14px 30px", fontSize: 50, fontWeight: 700,
        lineHeight: 1.35, textAlign: "center", color: tag ? "#fff" : C.text, fontStyle: "normal" }}>
        {current}
      </div>
    </div>
  );
};
