import { interpolate, useCurrentFrame } from "remotion";
import { fade, pulse, usePop } from "./anim";
import { FollowButton, PersonIcon, ShareArrow } from "./icons";
import { Label, Stage } from "./Stage";
import { C } from "./theme";

export type Audience = { label: string; cap?: boolean; count?: number; color?: string };

const AudienceItem: React.FC<{ a: Audience; delay: number }> = ({ a, delay }) => {
  const p = usePop(delay);
  const n = a.count ?? 1;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `scale(${p})` }}>
      <div style={{ display: "flex" }}>
        {Array.from({ length: n }).map((_, k) => (
          <PersonIcon key={k} size={n > 1 ? 150 : 190} cap={a.cap} color={a.color ?? C.muted} style={{ marginLeft: k ? -40 : 0 }} />
        ))}
      </div>
      <Label size={48}>{a.label}</Label>
    </div>
  );
};

/** Share arrow pointing to audience icons, follow button pulses. */
export const Outro: React.FC<{ audiences: Audience[]; source: string }> = ({ audiences, source }) => {
  const frame = useCurrentFrame();
  const arrow = usePop(0);
  const follow = usePop(40);
  return (
    <>
      <Stage style={{ justifyContent: "flex-start", paddingTop: 30 }}>
        <div style={{ transform: `scale(${arrow}) rotate(${interpolate(arrow, [0, 1], [-30, 0])}deg)` }}>
          <ShareArrow size={200} color={C.yellow} />
        </div>
        <div style={{ display: "flex", gap: 90, marginTop: 40 }}>
          {audiences.map((a, i) => (
            <AudienceItem key={a.label} a={a} delay={12 + i * 10} />
          ))}
        </div>
        <div style={{ marginTop: 60, opacity: follow }}>
          <FollowButton scale={follow * pulse(frame, 0.25, 0.07)} />
        </div>
      </Stage>
      <div
        style={{
          position: "absolute",
          top: 1640,
          left: 90,
          right: 150,
          textAlign: "center",
          fontSize: 30,
          color: C.muted,
          opacity: fade(frame, 20),
          lineHeight: 1.35,
        }}
      >
        {source}
      </div>
    </>
  );
};
