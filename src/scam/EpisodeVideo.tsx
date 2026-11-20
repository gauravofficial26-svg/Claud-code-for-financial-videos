import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { C, FONT } from "./theme";
import type { Episode, EpisodeProps } from "./types";
import { Subtitles } from "./Subtitles";
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

export const EpisodeVideo: React.FC<EpisodeProps & { ep: Episode }> = ({ ep, useVoice, music, musicVolume, showSubtitles }) => {
  const { fps } = useVideoConfig();
  const timeline = sceneTimeline(ep, fps);
  return (
    <AbsoluteFill style={{ fontFamily: FONT, color: C.text, background: C.bg }}>
      {timeline.map(({ scene: s, index, from, dur }) => (
        <Sequence key={s.id} from={from} durationInFrames={dur} name={s.id}>
          <Fade first={index === 0}>
            <s.Visual dur={dur} />
          </Fade>
          {s.onScreen && <OnScreenText text={s.onScreen} />}
          {showSubtitles && <Subtitles text={s.voiceover} durationInFrames={dur} />}
          {useVoice && ep.voice && (
            <Sequence from={4} layout="none">
              <Audio src={staticFile(ep.voice.files[index])} />
            </Sequence>
          )}
        </Sequence>
      ))}
      <Header ep={ep} />
      {music && <Audio src={staticFile(music)} volume={musicVolume} loop />}
    </AbsoluteFill>
  );
};
