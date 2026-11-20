// Episode 5 – Call-merging OTP trick: Priya's story
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LOOKS, Person } from "../characters";
import { BankIcon } from "../icons";
import { ChipX, Flash, NameTag, OutroScene, PopCard, Shake, Stamp, StepsScene, clamp, usePop } from "../kit";
import { CallScreen } from "../props";
import { Cam, Desk, Notification, PhoneCloseup, Room } from "../sets";
import { Sfx } from "../Sfx";
import { C } from "../theme";
import { at, speaking } from "../timeline";
import type { SceneProps } from "../types";

type V = React.FC<SceneProps>;

const Digit: React.FC<{ d: string; x: number; y: number }> = ({ d, x, y }) => (
  <div style={{ position: "absolute", left: x, top: y, width: 90, height: 110, borderRadius: 18, background: C.yellow, color: C.bg, fontSize: 76, fontWeight: 800,
    display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 24px rgba(0,0,0,0.5)" }}>{d}</div>
);

/* Hook: glowing MERGE button, tap, OTP digits fly to the scammer */
export const HookScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  const tap = n.from;
  const fly = interpolate(frame, [tap + 4, tap + 30], [0, 1], { ...clamp, easing: (t) => t * t });
  return (
    <Shake at={tap + 2} amt={1.5}>
      <Cam to={1.08} dur={n.to}>
        <PhoneCloseup skin={LOOKS.priya.skin}>
          <CallScreen name="अनजान नंबर" second={{ name: "दूसरी कॉल", locked: true }} mergeGlow pressed={frame >= tap && frame < tap + 5} />
        </PhoneCloseup>
      </Cam>
      {frame >= tap + 4 && ["4", "7", "1", "9"].map((d, i) => (
        <Digit key={i} d={d} x={interpolate(fly, [0, 1], [380 + i * 100, 820 + i * 20])} y={interpolate(fly, [0, 1], [900, 300 - i * 30])} />
      ))}
      <div style={{ position: "absolute", right: 0, top: 120, width: 300, height: 380, overflow: "hidden", opacity: interpolate(frame, [tap, tap + 8], [0, 1], clamp) }}>
        <Person look={LOOKS.scammer} expr="evil" arm="phoneEar" width={280} style={{ position: "absolute", left: 10, top: 10 }} seed={51} />
      </div>
      <Flash at={tap} color={C.red} />
      <Sfx name="pop" at={tap} />
      <Sfx name="whoosh" at={tap + 6} />
    </Shake>
  );
};

/* Intro: Priya gets a call from an unknown number */
export const IntroScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const answer = cues[1].from - 6;
  const ringing = frame > at(cues[0], 0.4) && frame < answer;
  const scam = usePop(cues[1].from, 12);
  return (
    <Cam dur={dur}>
      <Room>
        <Person look={LOOKS.priya} expr={frame > cues[2].from ? "worried" : "neutral"} talking={speaking(cues, "priya", frame)} arm={frame >= answer ? "phoneEar" : "down"}
          width={560} style={{ position: "absolute", left: 200, top: 400 }} seed={52} />
        <Desk phoneOnDesk={frame < answer} buzz={ringing} />
      </Room>
      <div style={{ position: "absolute", right: 30, top: 300, width: 300, height: 400, overflow: "hidden", borderRadius: 30, border: `4px solid ${C.red}`, background: "#111318",
        transform: `scale(${scam})`, transformOrigin: "top right" }}>
        <Person look={LOOKS.scammer} expr="grin" talking={speaking(cues, "scammer", frame)} arm="phoneEar" width={280} style={{ position: "absolute", left: 10, top: 20 }} seed={53} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.red, fontSize: 30, fontWeight: 800, textAlign: "center", padding: 4 }}>अनजान कॉलर</div>
      </div>
      <NameTag name="प्रिया" sub="कॉलेज स्टूडेंट" at={6} style={{ left: 0, top: 230 }} />
      <Sfx name="buzz" at={at(cues[0], 0.4)} volume={0.8} />
    </Cam>
  );
};

/* Merge: two calls, the second is the bank's hidden OTP call */
export const MergeScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  const reveal = usePop(at(n, 0.45), 11);
  return (
    <AbsoluteFill>
      <PhoneCloseup skin={LOOKS.priya.skin}>
        <CallScreen name="अनजान नंबर" second={{ name: frame >= at(n, 0.45) ? "बैंक OTP कॉल" : "दोस्त?", locked: true }} mergeGlow pressed={frame >= cues[0].to && frame < cues[0].to + 5} />
      </PhoneCloseup>
      {frame >= at(n, 0.45) && (
        <div style={{ position: "absolute", left: 80, right: 80, top: 1080, transform: `scale(${reveal})` }}>
          <div style={{ background: C.red, color: "#fff", fontSize: 58, fontWeight: 800, textAlign: "center", padding: "18px 20px", borderRadius: 24 }}>दूसरा कॉल = बैंक का OTP कॉल!</div>
        </div>
      )}
      <Sfx name="pop" at={cues[0].to} />
      <Sfx name="slam" at={at(n, 0.45)} volume={0.5} />
    </AbsoluteFill>
  );
};

/* Listen: three-way call diagram, OTP reaches the scammer */
export const ListenScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const ivr = cues[0];
  const digits = ["4", "7", "1", "9"];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E1B4B, #0A0E1A 80%)" }}>
      {/* bank (top) */}
      <PopCard at={0} style={{ position: "absolute", left: 390, top: 220, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: 300, height: 300, borderRadius: 99, background: "#1E293B", border: `6px solid #A5B4FC`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <BankIcon size={180} color="#A5B4FC" />
        </div>
        <div style={{ fontSize: 40, fontWeight: 800, color: "#A5B4FC", marginTop: 8 }}>बैंक OTP कॉल</div>
      </PopCard>
      {/* priya (left) and scammer (right) */}
      <div style={{ position: "absolute", left: 20, top: 760, width: 400, height: 480, overflow: "hidden" }}>
        <Person look={LOOKS.priya} expr="neutral" arm="phoneEar" width={380} style={{ position: "absolute", left: 0, top: 0 }} seed={54} />
      </div>
      <div style={{ position: "absolute", right: 20, top: 760, width: 400, height: 480, overflow: "hidden" }}>
        <Person look={LOOKS.scammer} expr="evil" arm="phoneEar" width={380} style={{ position: "absolute", left: 10, top: 0 }} seed={55} />
      </div>
      <div style={{ position: "absolute", left: 60, top: 1230, fontSize: 40, fontWeight: 800 }}>प्रिया</div>
      <div style={{ position: "absolute", right: 60, top: 1230, fontSize: 40, fontWeight: 800, color: C.red }}>ठग (चुपचाप)</div>
      {/* sound waves */}
      <svg width={1080} height={1300} style={{ position: "absolute" }}>
        {[0, 1, 2].map((i) => {
          const o = ((frame + i * 10) % 30) / 30;
          return (
            <g key={i} opacity={1 - o} fill="none" strokeWidth="8" strokeLinecap="round">
              <path d={`M${450 - o * 120} ${560 + o * 160} q -30 20 -20 50`} stroke="#A5B4FC" />
              <path d={`M${630 + o * 120} ${560 + o * 160} q 30 20 20 50`} stroke={C.red} />
            </g>
          );
        })}
      </svg>
      {digits.map((d, i) => {
        const s = at(ivr, 0.45 + i * 0.12);
        const u = interpolate(frame, [s, s + 24], [0, 1], clamp);
        if (frame < s) return null;
        return <Digit key={i} d={d} x={interpolate(u, [0, 1], [500, 640 + i * 95])} y={interpolate(u, [0, 1], [560, 640])} />;
      })}
      <Stamp text="ठग ने सुन लिया" at={cues[1].from + 4} size={56} style={{ left: 300, top: 1060 }} />
    </AbsoluteFill>
  );
};

/* Loot: debit alerts, Priya in shock */
export const LootScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  return (
    <Cam dur={dur} to={1.04}>
      <Room>
        <Person look={LOOKS.priya} expr="shock" talking={speaking(cues, "priya", frame)} arm="cheek" width={560} style={{ position: "absolute", left: 260, top: 520 }} seed={56} />
        <Desk laptop={false} />
      </Room>
      <div style={{ position: "absolute", top: 180, left: 80, right: 80 }}>
        <Notification at={2} title="बैंक SMS" body="₹ 24,999 डेबिट · OTP से" color={C.red} icon="−" />
        <Notification at={at(cues[1], 0.2)} title="बैंक SMS" body="₹ 18,500 डेबिट · OTP से" color={C.red} icon="−" />
      </div>
      <Sfx name="ping" at={2} />
      <Sfx name="ping" at={at(cues[1], 0.2)} />
    </Cam>
  );
};

/* Rule: bank never asks; never merge unknown calls */
export const RuleScene: V = ({ cues }) => {
  const n = cues[0];
  const t = [at(n, 0.15), at(n, 0.27), at(n, 0.39)];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #14532D, #0A0E1A 80%)", alignItems: "center" }}>
      <PopCard at={0} style={{ marginTop: 220, display: "flex", alignItems: "center", gap: 30 }}>
        <BankIcon size={170} color="#CBD5E1" />
        <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.2 }}>बैंक फोन पर<br />कभी नहीं माँगता</div>
      </PopCard>
      <div style={{ marginTop: 40, display: "flex", gap: 20 }}>
        {["OTP", "PIN", "CVV"].map((x, i) => <ChipX key={x} text={x} at={t[i]} size={56} />)}
      </div>
      <PopCard at={at(n, 0.62)} from="up" style={{ marginTop: 50 }}>
        <div style={{ background: C.red, color: "#fff", fontSize: 62, fontWeight: 800, padding: "18px 40px", borderRadius: 24 }}>अनजान कॉल = कभी मर्ज नहीं</div>
      </PopCard>
      {t.map((x) => <Sfx key={x} name="pop" at={x + 10} />)}
    </AbsoluteFill>
  );
};

export const Steps: V = (p) => (
  <StepsScene {...p} look={LOOKS.priya} who="priya" steps={["कॉल काटो", "ब्लॉक और रिपोर्ट", "असली कस्टमर केयर"]} />
);

export const SOURCE = "स्रोत: मुंबई साइबर पुलिस (कॉल मर्जिंग स्कैम) · शिकायत: 1930 या cybercrime.gov.in · कहानी काल्पनिक है";

export const Outro: V = (p) => (
  <OutroScene {...p} look={LOOKS.priya} who="priya" source={SOURCE}
    audiences={[{ label: "मम्मी-पापा", looks: [LOOKS.dad, LOOKS.mom] }, { label: "भाई-बहन", looks: [LOOKS.friend2, LOOKS.pinky] }]} />
);
