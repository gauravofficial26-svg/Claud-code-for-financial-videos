// Shared building blocks for story episodes (Episode 2 onwards)
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOOKS, Person, type Look } from "./characters";
import { CrossMark, FollowButton, ShareArrow } from "./icons";
import { Desk, Room } from "./sets";
import { Sfx } from "./Sfx";
import { C } from "./theme";
import { at, speaking } from "./timeline";
import type { SceneProps, Speaker } from "./types";

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const Shake: React.FC<{ at: number; children: React.ReactNode; amt?: number }> = ({ at: a, children, amt = 2.5 }) => {
  const frame = useCurrentFrame();
  const k = frame >= a && frame < a + 12 ? (a + 12 - frame) * amt : 0;
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 3.1) * k}px, ${Math.cos(frame * 2.3) * k}px)` }}>{children}</AbsoluteFill>;
};

export const Flash: React.FC<{ at: number; color?: string }> = ({ at: a, color = "#fff" }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(frame, [a, a + 2, a + 10], [0, 0.7, 0], clamp), pointerEvents: "none" }} />;
};

export const Stamp: React.FC<{ text: string; at: number; color?: string; style?: React.CSSProperties; size?: number; rotate?: number }> = ({ text, at: a, color = C.red, style, size = 70, rotate = -10 }) => {
  const p = usePop(a, 9);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", border: `8px solid ${color}`, color, fontSize: size, fontWeight: 800, padding: "0 28px", borderRadius: 16, whiteSpace: "nowrap",
      background: "rgba(10,14,26,0.88)", transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 2), ...style }}>
      {text}
    </div>
  );
};

export const NameTag: React.FC<{ name: string; sub: string; at: number; style?: React.CSSProperties }> = ({ name, sub, at: a, style }) => {
  const p = usePop(a, 14);
  return (
    <div style={{ position: "absolute", transform: `translateX(${(1 - p) * -500}px)`, display: "flex", ...style }}>
      <div style={{ width: 14, background: C.yellow }} />
      <div style={{ background: "rgba(10,14,26,0.88)", padding: "12px 28px" }}>
        <div style={{ fontSize: 56, fontWeight: 800 }}>{name}</div>
        <div style={{ fontSize: 34, color: C.muted, fontWeight: 700 }}>{sub}</div>
      </div>
    </div>
  );
};

/** A rounded card that pops in */
export const PopCard: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; from?: "left" | "right" | "up" | "scale" }> = ({ at: a, children, style, from = "scale" }) => {
  const p = usePop(a, 13);
  const t = from === "left" ? `translateX(${(1 - p) * -400}px)` : from === "right" ? `translateX(${(1 - p) * 400}px)` : from === "up" ? `translateY(${(1 - p) * 200}px)` : `scale(${interpolate(p, [0, 1], [0.6, 1])})`;
  return <div style={{ opacity: Math.min(1, p * 1.5), transform: t, ...style }}>{children}</div>;
};

/** Text chip that gets crossed out */
export const ChipX: React.FC<{ text: string; at: number; crossAfter?: number; size?: number }> = ({ text, at: a, crossAfter = 10, size = 52 }) => {
  const frame = useCurrentFrame();
  const p = usePop(a, 12);
  const x = interpolate(frame, [a + crossAfter, a + crossAfter + 10], [0, 1], clamp);
  return (
    <div style={{ position: "relative", background: "rgba(22,30,51,0.96)", border: `4px solid ${C.border}`, borderRadius: 26, padding: "18px 90px 18px 30px", textAlign: "center",
      fontSize: size, fontWeight: 800, transform: `scale(${p})` }}>
      {text}
      <div style={{ position: "absolute", right: 14, top: "50%", marginTop: -36 }}>
        <CrossMark size={72} progress={x} />
      </div>
    </div>
  );
};

export const StepRow: React.FC<{ n: number; text: string; at: number }> = ({ n, text, at: a }) => {
  const p = usePop(a, 13);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(22,30,51,0.96)", border: `4px solid ${C.border}`, borderRadius: 28, padding: "16px 28px",
      marginBottom: 18, opacity: p, transform: `translateX(${(1 - p) * -300}px)` }}>
      <div style={{ flex: "0 0 auto", width: 80, height: 80, borderRadius: 99, background: C.green, color: C.bg, fontSize: 50, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.15 }}>{text}</div>
    </div>
  );
};

/** Floating ₹ coins rising */
export const Coins: React.FC<{ x: number; y: number; n?: number; spread?: number }> = ({ x, y, n = 5, spread = 110 }) => {
  const frame = useCurrentFrame();
  return (
    <>
      {Array.from({ length: n }).map((_, i) => {
        const k = (frame + i * 20) % 60;
        return (
          <div key={i} style={{ position: "absolute", left: x + i * spread, top: interpolate(k, [0, 60], [y, y - 300]), width: 56, height: 56, borderRadius: 99, background: C.yellow, color: C.bg,
            fontSize: 36, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate(k, [0, 10, 50, 60], [0, 1, 1, 0]) }}>₹</div>
        );
      })}
    </>
  );
};

/** Three steps + the character calling 1930 */
export const StepsScene: React.FC<SceneProps & { look: Look; who: Speaker; steps: string[]; badgeTop?: string }> = ({ dur, cues, look, who, steps, badgeTop = "ठगी हुई? कॉल करें" }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  const stepAt = steps.map((_, i) => at(n, i * 0.22));
  const callAt = at(n, 0.72);
  const call = usePop(callAt, 11);
  const onCall = frame >= callAt;
  return (
    <AbsoluteFill style={{ transform: `scale(${interpolate(frame, [0, dur], [1, 1.03])})` }}>
      <Room>
        <Person look={look} expr={onCall ? "neutral" : "happy"} talking={speaking(cues, who, frame)} arm={onCall ? "phoneEar" : "down"} width={520}
          style={{ position: "absolute", left: 120, top: 560 }} seed={13} />
        <Desk laptop={false} lamp={false} />
      </Room>
      <div style={{ position: "absolute", top: 180, left: 60, right: 60 }}>
        {steps.map((s, i) => <StepRow key={s} n={i + 1} text={s} at={stepAt[i]} />)}
      </div>
      <div style={{ position: "absolute", left: 600, top: 680, transform: `scale(${call * (1 + Math.sin(frame * 0.3) * 0.04)})`, background: C.green, color: C.bg, borderRadius: 40, padding: "18px 36px",
        textAlign: "center", boxShadow: `0 0 40px ${C.green}` }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>{badgeTop}</div>
        <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1 }}>1930</div>
      </div>
      {stepAt.map((t) => <Sfx key={t} name="pop" at={t} />)}
      <Sfx name="ping" at={callAt} />
    </AbsoluteFill>
  );
};

export type Audience = { label: string; looks: Look[] };

/** Host waves and says the closing line; share arrows to audience groups; follow button */
export const OutroScene: React.FC<SceneProps & { look: Look; who: Speaker; audiences: Audience[]; source: string }> = ({ cues, look, who, audiences, source }) => {
  const frame = useCurrentFrame();
  const n = cues[cues.length - 1];
  const a0 = usePop(n.from, 12);
  const a1 = usePop(n.from + 12, 12);
  const follow = usePop(at(n, 0.5), 10);
  const pops = [a0, a1];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E3A5F, #0A0E1A 80%)" }}>
      <Person look={look} expr="happy" talking={speaking(cues, who, frame)} arm="wave" width={430} style={{ position: "absolute", left: 325, top: 230 }} seed={14} />
      {audiences.slice(0, 2).map((au, i) => {
        const p = pops[i];
        const left = i === 0;
        return (
          <div key={au.label}>
            <ShareArrow size={150} color={C.yellow} style={{ position: "absolute", [left ? "left" : "right"]: 200, top: 650, transform: `${left ? "scaleX(-1) " : ""}rotate(20deg) scale(${p})` }} />
            <div style={{ position: "absolute", [left ? "left" : "right"]: 10, top: 780, display: "flex", opacity: p, transform: `scale(${p})` }}>
              {au.looks.map((l, k) => <Person key={k} look={l} expr="happy" width={200} seed={15 + k + i * 3} style={{ marginLeft: k ? -70 : 0 }} />)}
            </div>
            <div style={{ position: "absolute", [left ? "left" : "right"]: 20, top: 1095, width: 360, textAlign: "center", fontSize: 42, fontWeight: 800, opacity: p }}>{au.label}</div>
          </div>
        );
      })}
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: follow }}>
        <FollowButton scale={follow * (1 + Math.sin(frame * 0.25) * 0.06)} />
      </div>
      <div style={{ position: "absolute", top: 1720, left: 90, right: 150, textAlign: "center", fontSize: 28, color: C.muted, lineHeight: 1.35 }}>{source}</div>
      <Sfx name="whoosh" at={n.from} />
      <Sfx name="whoosh" at={n.from + 12} />
      <Sfx name="pop" at={at(n, 0.5)} />
    </AbsoluteFill>
  );
};

export { LOOKS };
