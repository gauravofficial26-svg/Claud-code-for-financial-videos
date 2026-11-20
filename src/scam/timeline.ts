import type { Cue, Episode, Speaker } from "./types";

const CHARS_PER_SEC = 15; // fallback when no voice has been generated yet

export type TimedScene = { index: number; from: number; dur: number; cues: Cue[] };

export const sceneTimeline = (ep: Episode, fps: number): TimedScene[] => {
  let start = 0;
  return ep.scenes.map((s, i) => {
    const v = ep.voice?.scenes[i];
    let cues: Cue[];
    let dur: number;
    if (v && v.id === s.id && v.lines.length === s.lines.length) {
      cues = v.lines.map((l) => ({ who: l.who as Speaker, text: l.text, file: l.file, from: Math.round(l.start * fps), to: Math.round((l.start + l.dur) * fps) }));
      dur = Math.round(v.dur * fps);
    } else {
      let t = 0.15;
      cues = s.lines.map((l) => {
        const d = l.text.length / CHARS_PER_SEC;
        const c = { ...l, from: Math.round(t * fps), to: Math.round((t + d) * fps) };
        t += d + 0.2;
        return c;
      });
      dur = Math.round((t + 0.3) * fps);
    }
    const item = { index: i, from: start, dur, cues };
    start += dur;
    return item;
  });
};

export const episodeFrames = (ep: Episode, fps: number) => sceneTimeline(ep, fps).reduce((a, s) => a + s.dur, 0);

export const speaking = (cues: Cue[], who: Speaker, frame: number) => cues.some((c) => c.who === who && frame >= c.from && frame < c.to);

/** frame at a fraction through a cue */
export const at = (c: Cue | undefined, f = 0) => (c ? Math.round(c.from + (c.to - c.from) * f) : 0);
