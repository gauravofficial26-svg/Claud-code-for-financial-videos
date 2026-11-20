import type { Episode, Line, SceneProps, VoiceMeta } from "./types";

type ScriptJson = { scenes: { id: string; lines: { who: string; text: string }[] }[] };

/** Build an Episode from its script.json, voice.json and a map of scene visuals */
export const makeEpisode = (o: {
  id: string;
  number: number;
  title: string;
  script: ScriptJson;
  voice?: unknown;
  visuals: Record<string, React.FC<SceneProps>>;
  onScreen?: Record<string, string>;
  caption: string;
  source: string;
}): Episode => ({
  id: o.id,
  number: o.number,
  title: o.title,
  caption: o.caption,
  source: o.source,
  voice: o.voice as VoiceMeta | undefined,
  music: `audio/ep${o.number}/music.mp3`,
  scenes: o.script.scenes.map((s) => {
    const Visual = o.visuals[s.id];
    if (!Visual) throw new Error(`Episode ${o.number}: no visual for scene "${s.id}"`);
    return { id: s.id, lines: s.lines as Line[], onScreen: o.onScreen?.[s.id], Visual };
  }),
});
