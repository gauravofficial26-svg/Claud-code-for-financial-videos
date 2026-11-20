import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { C, FONT } from "./theme";
import type { Episode, EpisodeProps } from "./types";
import { Subtitles } from "./Subtitles";
import { SfxLevel } from "./Sfx";
import { sceneTimeline } from "./timeline";

const Header: React.FC<{ ep: Episode }> = ({ ep }) => (
  <div style={{ position: "absolute", top: 70, left: 40, display: "flex", gap: 14 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.red, color: "#fff", fontSize: 34, fontWeight: 800, padding: "6px 22px", borderRadius: 12, letterSpacing: 1 }}>
      <svg width="34" height="30" viewBox="0 0 34 30"><path d="M17 2 L32 28 H2 Z" fill="#fff" /><rect x="15.5" y="10" width="3" height="10" fill={C.red} /><rect x="15.5" y="22" width="3" height="3" fill={C.red} /></svg>
      SCAM ALERT
    </div>
    <div style={{ background: "rgba(10,14,26,0.75)", color: C.text, fontSize: 34, fontWeight: 700, padding: "6px 22px", borderRadius: 12 }}>
      EP {ep.number} · {ep.title}
    </div>
  </div>
);

const OnScreenText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [2, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", top: 1255, left: 50, right: 50, display: "flex", justifyContent: "center" }}>
      <div style={{ fontSize: 74, fontWeight: 800, lineHeight: 1.15, color: C.yellow, textAlign: "center", opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`, textShadow: "0 4px 0 #000, 0 0 30px rgba(0,0,0,0.9)" }}>
        {text}
      </div>
    </div>
  );
};

const Fade: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 6], [0, 1], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ opacity: p }}>{children}</AbsoluteFill>;
};

export const EpisodeVideo: React.FC<EpisodeProps & { ep: Episode }> = ({ ep, useVoice, useMusic, musicVolume, sfxVolume, showSubtitles }) => {
  const { fps } = useVideoConfig();
  const timeline = sceneTimeline(ep, fps);
  // global speech intervals, used to duck the music under dialogue
  const speech = timeline.flatMap((t) => t.cues.map((c) => [t.from + c.from + 4, t.from + c.to + 4] as const));
  const musicVol = (f: number) => {
    let d = Infinity;
    for (const [a, b] of speech) d = Math.min(d, f < a ? a - f : f > b ? f - b : 0);
    return musicVolume * interpolate(d, [0, 10], [0.35, 1], { extrapolateRight: "clamp" });
  };
  return (
    <SfxLevel.Provider value={sfxVolume}>
      <AbsoluteFill style={{ fontFamily: FONT, color: C.text, background: C.bg }}>
        {timeline.map(({ index, from, dur, cues }) => {
          const s = ep.scenes[index];
          return (
            <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
              <Fade first={index === 0}>
                <s.Visual dur={dur} cues={cues} />
              </Fade>
              {s.onScreen && <OnScreenText text={s.onScreen} />}
              {showSubtitles && <Subtitles cues={cues} />}
              {useVoice &&
                cues.map((c, i) =>
                  c.file ? (
                    <Sequence key={i} from={c.from + 4} layout="none" name={`${c.who}: ${c.text.slice(0, 20)}`}>
                      <Audio src={staticFile(c.file)} />
                    </Sequence>
                  ) : null,
                )}
            </Sequence>
          );
        })}
        <Header ep={ep} />
        {useMusic && ep.music && <Audio src={staticFile(ep.music)} volume={musicVol} />}
      </AbsoluteFill>
    </SfxLevel.Provider>
  );
};
