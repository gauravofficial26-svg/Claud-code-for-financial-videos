import type { Episode } from "./types";

const PAD = 0.45; // breathing room after each spoken line (s)
const CHARS_PER_SEC = 15; // fallback estimate when no voice clips exist

export const sceneTimeline = (ep: Episode, fps: number) => {
  let start = 0;
  return ep.scenes.map((s, i) => {
    const speech = ep.voice?.durations[i] ?? s.voiceover.length / CHARS_PER_SEC;
    const dur = Math.round((speech + PAD + (i === 0 ? 0.2 : 0)) * fps);
    const item = { scene: s, index: i, from: start, dur };
    start += dur;
    return item;
  });
};

export const episodeFrames = (ep: Episode, fps: number) =>
  sceneTimeline(ep, fps).reduce((a, s) => a + s.dur, 0);
