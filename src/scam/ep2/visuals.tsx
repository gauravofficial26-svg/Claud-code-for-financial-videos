// Episode 2 – Fingerprint (AePS) fraud: Ramesh ji's story
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LOOKS, Person } from "../characters";
import { BankIcon } from "../icons";
import { Flash, NameTag, OutroScene, PopCard, Shake, Stamp, StepsScene, clamp, usePop } from "../kit";
import { DocPaper, Fingerprint, IdCard, Padlock, Scanner, Toggle } from "../props";
import { Cam, Desk, Home, Notification, PhoneCloseup, Room, Station, Table } from "../sets";
import { Sfx } from "../Sfx";
import { C } from "../theme";
import { at, speaking } from "../timeline";
import type { SceneProps } from "../types";

type V = React.FC<SceneProps>;

/* Hook: debit SMS after debit SMS, balance falling, a red fingerprint */
export const HookScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  const bal = interpolate(frame, [4, n.from], [48500, 2300], clamp);
  const fp = usePop(n.from, 10);
  return (
    <Shake at={n.from + 2} amt={2}>
      <Home>
        <Person look={LOOKS.ramesh} expr="shock" talking={speaking(cues, "ramesh", frame)} arm="cheek" width={560} style={{ position: "absolute", left: 260, top: 560 }} seed={21} />
      </Home>
      <div style={{ position: "absolute", top: 170, left: 70, right: 70 }}>
        <Notification at={2} title="बैंक SMS" body="₹ 15,000 डेबिट · AePS" color={C.red} icon="−" />
        <Notification at={12} title="बैंक SMS" body="₹ 20,000 डेबिट · AePS" color={C.red} icon="−" />
        <Notification at={22} title="बैंक SMS" body={`बैलेंस: ₹${Math.round(bal).toLocaleString("en-IN")}`} color={C.red} icon="₹" />
      </div>
      {frame >= n.from && (
        <AbsoluteFill style={{ background: "rgba(10,14,26,0.75)", alignItems: "center", justifyContent: "center" }}>
          <div style={{ transform: `scale(${fp * (1 + Math.sin(frame * 0.3) * 0.04)})` }}>
            <Fingerprint size={420} glow />
          </div>
        </AbsoluteFill>
      )}
      <Flash at={n.from} color={C.red} />
      {[2, 12, 22].map((t) => <Sfx key={t} name="ping" at={t} />)}
      <Sfx name="slam" at={n.from} />
    </Shake>
  );
};

/* Intro: Ramesh ji puts his thumb impression on a property registry */
export const IntroScene: V = ({ dur }) => (
  <Cam dur={dur}>
    <Station>
      <Person look={LOOKS.ramesh} expr="happy" arm="down" width={520} style={{ position: "absolute", left: 50, top: 520 }} seed={22} />
      <Table />
      <DocPaper width={360} stampAt={Math.round(dur * 0.55)} style={{ position: "absolute", right: 90, top: 520, transform: "rotate(4deg)" }} />
    </Station>
    <NameTag name="रमेश जी" sub="दुकानदार" at={6} style={{ left: 0, top: 260 }} />
    <Sfx name="pop" at={Math.round(dur * 0.55)} />
  </Cam>
);

/* Leak: documents -> scammer's laptop */
export const LeakScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #1E293B, #0A0E1A 80%)" }}>
      <PopCard at={0} from="left" style={{ position: "absolute", left: 60, top: 240 }}><DocPaper width={300} stampAt={0} /></PopCard>
      <PopCard at={8} from="left" style={{ position: "absolute", left: 90, top: 680 }}><IdCard width={360} /></PopCard>
      <svg width={1080} height={1300} style={{ position: "absolute" }}>
        <path d="M420 560 C 600 500 640 700 760 760" fill="none" stroke={C.red} strokeWidth="10" strokeDasharray="24 18" strokeDashoffset={-frame * 3} />
      </svg>
      {[0, 1, 2].map((i) => {
        const u = ((frame - 10 - i * 12) % 45) / 45;
        if (frame < 10 + i * 12) return null;
        const x = interpolate(u, [0, 1], [420, 760]);
        const y = interpolate(u, [0, 0.5, 1], [560, 600, 760]);
        return <div key={i} style={{ position: "absolute", left: x - 40, top: y - 48, opacity: 0.9 }}><Fingerprint size={80} color={C.red} /></div>;
      })}
      <div style={{ position: "absolute", right: 30, top: 620, width: 440, height: 560, overflow: "hidden" }}>
        <Person look={LOOKS.scammer} expr="evil" arm="phone" width={400} style={{ position: "absolute", left: 20, top: 0 }} seed={23} />
        <div style={{ position: "absolute", left: 0, right: 0, top: 380, height: 40, background: "#3F2C1A", borderRadius: 8 }} />
      </div>
      <Stamp text="डेटा लीक" at={Math.round(dur * 0.55)} style={{ left: 560, top: 300 }} />
    </AbsoluteFill>
  );
};

/* Clone: silicone print placed on a small scanner */
export const CloneScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const place = interpolate(frame, [Math.round(dur * 0.35), Math.round(dur * 0.55)], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1F2430, #0A0E1A 80%)" }}>
      <Scanner width={560} style={{ position: "absolute", left: 260, top: 420 }} screen={<span>आधार: XXXX 4821<br />उँगली रखें</span>} />
      <div style={{ position: "absolute", left: interpolate(place, [0, 1], [700, 425]), top: interpolate(place, [0, 1], [260, 720]), opacity: 0.85,
        transform: `rotate(${(1 - place) * 30}deg)`, filter: "drop-shadow(0 0 12px #F9A8D4)" }}>
        <div style={{ background: "rgba(249,168,212,0.55)", borderRadius: 60, padding: 16 }}><Fingerprint size={200} color="#FBCFE8" /></div>
      </div>
      <PopCard at={4} style={{ position: "absolute", left: 640, top: 230 }}>
        <div style={{ background: "#F9A8D4", color: C.bg, fontSize: 40, fontWeight: 800, padding: "8px 22px", borderRadius: 14 }}>नकली सिलिकॉन निशान</div>
      </PopCard>
      <div style={{ position: "absolute", left: 0, top: 820, width: 380, height: 520, overflow: "hidden" }}>
        <Person look={LOOKS.scammer} expr="evil" talking={speaking(cues, "scammer", frame)} arm="cross" width={360} style={{ position: "absolute", left: 10, top: 0 }} seed={24} />
      </div>
      <Sfx name="whoosh" at={Math.round(dur * 0.35)} />
      <Sfx name="pop" at={Math.round(dur * 0.55)} />
    </AbsoluteFill>
  );
};

/* Match: scanner says MATCH, cash leaves the bank, Ramesh gets an SMS */
export const MatchScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  const sms = at(n, 0.62);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E293B, #0A0E1A 80%)" }}>
      <Scanner width={420} glow={C.green} style={{ position: "absolute", left: 60, top: 260 }} screen={<span style={{ color: C.green, fontSize: 48 }}>✓ मैच</span>} />
      <div style={{ position: "absolute", right: 90, top: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <BankIcon size={300} color="#CBD5E1" />
        <div style={{ fontSize: 40, fontWeight: 800, color: C.muted }}>बैंक</div>
      </div>
      {[0, 1, 2, 3, 4].map((i) => {
        const k = (frame + i * 12) % 50;
        return <div key={i} style={{ position: "absolute", left: interpolate(k, [0, 50], [760, 300]), top: interpolate(k, [0, 50], [560, 760]) + i * 6, width: 120, height: 60, borderRadius: 8,
          background: "#86EFAC", border: "4px solid #15803D", color: "#14532D", fontSize: 34, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
          transform: `rotate(${-15 + i * 6}deg)`, opacity: interpolate(k, [0, 6, 44, 50], [0, 1, 1, 0]) }}>₹</div>;
      })}
      <Stamp text="बैंक को लगा: असली रमेश जी" at={4} color={C.yellow} size={52} rotate={-4} style={{ left: 120, top: 860 }} />
      <div style={{ position: "absolute", left: 90, right: 90, top: 1010 }}>
        <Notification at={sms} title="रमेश जी का फोन · SMS" body="आपके खाते से ₹ डेबिट हुए" color={C.red} icon="−" />
      </div>
      <Sfx name="pop" at={2} />
      <Sfx name="ping" at={sms} />
    </AbsoluteFill>
  );
};

/* Lock: daughter Neha shows how to lock biometrics */
export const LockScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  const cut = n.from - 4;
  if (frame < cut) {
    const enter = usePopLocal(frame, 0);
    return (
      <Cam dur={cut}>
        <Home>
          <Person look={LOOKS.ramesh} expr="worried" arm="down" width={500} style={{ position: "absolute", left: 30, top: 600 }} seed={25} />
          <Person look={LOOKS.neha} expr="happy" talking={speaking(cues, "neha", frame)} arm="phone" width={500}
            style={{ position: "absolute", right: 30, top: 560, transform: `translateX(${(1 - enter) * 500}px)` }} seed={26} />
        </Home>
        <NameTag name="नेहा" sub="रमेश जी की बेटी" at={6} style={{ left: 0, top: 260 }} />
      </Cam>
    );
  }
  const on = interpolate(frame, [at(n, 0.65), at(n, 0.65) + 8], [0, 1], clamp);
  return (
    <PhoneCloseup skin={LOOKS.neha.skin}>
      <div style={{ position: "absolute", inset: 0, background: "#F8FAFC", color: "#0F172A", padding: "110px 40px 0" }}>
        <div style={{ fontSize: 52, fontWeight: 800 }}>आधार सेवाएँ</div>
        <div style={{ fontSize: 30, color: "#64748B", fontWeight: 700, marginBottom: 40 }}>uidai.gov.in / mAadhaar</div>
        {["आधार डाउनलोड", "पता अपडेट"].map((t) => <div key={t} style={{ fontSize: 40, fontWeight: 700, padding: "26px 0", borderBottom: "2px solid #E2E8F0", color: "#94A3B8" }}>{t}</div>)}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "34px 24px", margin: "20px -20px", borderRadius: 24, background: on > 0.5 ? "#DCFCE7" : "#FEF3C7" }}>
          <div>
            <div style={{ fontSize: 46, fontWeight: 800 }}>Lock Biometrics</div>
            <div style={{ fontSize: 32, fontWeight: 700, color: on > 0.5 ? "#15803D" : "#B45309" }}>{on > 0.5 ? "बायोमेट्रिक लॉक है ✓" : "अभी खुला है"}</div>
          </div>
          <Toggle on={on} width={150} />
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 40, gap: 30, alignItems: "center" }}>
          <Fingerprint size={150} color={on > 0.5 ? C.green : "#F59E0B"} />
          <Padlock open={1 - on} size={140} color={on > 0.5 ? C.green : "#F59E0B"} />
        </div>
      </div>
      <Sfx name="pop" at={at(n, 0.65)} />
    </PhoneCloseup>
  );
};

const usePopLocal = (frame: number, delay: number) => interpolate(frame, [delay, delay + 14], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });

/* Unlock only when needed, then lock again */
export const UnlockScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const open = interpolate(frame, [8, 18, dur * 0.55, dur * 0.55 + 10], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #14532D, #0A0E1A 80%)", alignItems: "center" }}>
      <div style={{ marginTop: 300, display: "flex", alignItems: "center", gap: 50 }}>
        <Fingerprint size={260} color={open > 0.5 ? "#F59E0B" : C.green} />
        <Padlock open={open} size={240} color={open > 0.5 ? "#F59E0B" : C.green} />
      </div>
      <div style={{ marginTop: 60, display: "flex", gap: 30 }}>
        <div style={{ fontSize: 56, fontWeight: 800, padding: "14px 30px", borderRadius: 20, background: open > 0.5 ? "#F59E0B" : "#1F2937", color: open > 0.5 ? C.bg : C.muted }}>ज़रूरत पर अनलॉक</div>
        <div style={{ fontSize: 56, fontWeight: 800, padding: "14px 30px", borderRadius: 20, background: open > 0.5 ? "#1F2937" : C.green, color: open > 0.5 ? C.muted : C.bg }}>फिर लॉक</div>
      </div>
      <Sfx name="pop" at={10} />
      <Sfx name="pop" at={Math.round(dur * 0.55)} />
    </AbsoluteFill>
  );
};

export const Steps: V = (p) => (
  <StepsScene {...p} look={LOOKS.ramesh} who="ramesh" steps={["तुरंत 1930 पर कॉल", "बैंक को लिखित में", "cybercrime.gov.in"]} badgeTop="पहला घंटा सबसे अहम" />
);

export const SOURCE = "स्रोत: गुजरात पुलिस साइबर सेंटर ऑफ़ एक्सीलेंस (AePS जागरूकता), UIDAI · शिकायत: 1930 या cybercrime.gov.in · कहानी काल्पनिक है";

export const Outro: V = (p) => (
  <OutroScene {...p} look={LOOKS.neha} who="neha" source={SOURCE}
    audiences={[{ label: "पापा", looks: [LOOKS.ramesh] }, { label: "मम्मी", looks: [LOOKS.mom] }]} />
);

export { Room, Desk };
