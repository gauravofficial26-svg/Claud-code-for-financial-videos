import { AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import "./fonts";
import { C, FONT } from "./theme";
import type { Episode, EpisodeProps } from "./types";
import { Subtitles } from "./Subtitles";

const Header: React.FC<{ ep: Episode }> = ({ ep }) => (
  <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 20 }}>
    <div
      style={{
        background: C.red,
        color: "#fff",
        fontSize: 40,
        fontWeight: 800,
        padding: "8px 28px",
        borderRadius: 14,
        letterSpacing: 2,
      }}
    >
      ⚠ SCAM ALERT
    </div>
    <div
      style={{
        background: C.panel,
        border: `2px solid ${C.border}`,
        color: C.text,
        fontSize: 40,
        fontWeight: 700,
        padding: "8px 28px",
        borderRadius: 14,
      }}
    >
      EP {ep.number} · {ep.title}
    </div>
  </div>
);

const OnScreenText: React.FC<{ text: string }> = ({ text }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [4, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        top: 1130,
        left: 70,
        right: 70,
        textAlign: "center",
        fontSize: 76,
        fontWeight: 800,
        lineHeight: 1.2,
        color: C.yellow,
        opacity: p,
        transform: `scale(${interpolate(p, [0, 1], [0.85, 1])})`,
        textShadow: "0 6px 24px rgba(0,0,0,0.6)",
      }}
    >
      {text}
    </div>
  );
};

const SceneShell: React.FC<{ children: React.ReactNode; first: boolean }> = ({ children, first }) => {
  const frame = useCurrentFrame();
  const p = first ? 1 : interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>{children}</AbsoluteFill>
  );
};

export const EpisodeVideo: React.FC<EpisodeProps & { ep: Episode }> = ({ ep, voiceover, music, musicVolume, showSubtitles }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        color: C.text,
        background: `radial-gradient(circle at 50% 35%, ${C.bg2} 0%, ${C.bg} 70%)`,
      }}
    >
      {ep.scenes.map((s, i) => {
        const from = Math.round(s.from * fps);
        const dur = Math.round((s.to - s.from) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} name={`${s.from}-${s.to}s`}>
            <SceneShell first={i === 0}>
              <s.Visual />
            </SceneShell>
            {s.onScreen && <OnScreenText text={s.onScreen} />}
            {showSubtitles && <Subtitles text={s.voiceover} durationInFrames={dur} />}
          </Sequence>
        );
      })}
      <Header ep={ep} />
      {voiceover && <Audio src={staticFile(voiceover)} />}
      {music && <Audio src={staticFile(music)} volume={musicVolume} loop />}
    </AbsoluteFill>
  );
};
