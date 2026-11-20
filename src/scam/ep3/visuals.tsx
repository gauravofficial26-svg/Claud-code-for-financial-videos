// Episode 3 – Fake "unclaimed money" and insurance-bonus calls: Sharma ji's story
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LOOKS, Person } from "../characters";
import { ChipX, Flash, NameTag, OutroScene, PopCard, Shake, Stamp, StepsScene, clamp } from "../kit";
import { BrowserCard, CallScreen, Piggy, PolicyDoc, PressureCard } from "../props";
import { Cam, ChatBubble, ChatHeader, Home, PhoneCloseup } from "../sets";
import { Sfx } from "../Sfx";
import { C } from "../theme";
import { at, speaking } from "../timeline";
import type { SceneProps } from "../types";

type V = React.FC<SceneProps>;

/* Hook: ringing call from a fake "RBI officer", then the piggy bank trap */
export const HookScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  if (frame < n.from) {
    return (
      <Cam to={1.1} dur={n.from}>
        <PhoneCloseup skin={LOOKS.sharma.skin}>
          <CallScreen name="RBI अधिकारी?" sub="बधाई हो! आपके पैसे..." ringing />
        </PhoneCloseup>
        <Sfx name="buzz" at={0} volume={0.8} />
      </Cam>
    );
  }
  return (
    <Shake at={n.from + 2}>
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 45%, #3B1D2A, #0A0E1A 80%)", alignItems: "center" }}>
        <div style={{ marginTop: 420, position: "relative" }}>
          <Piggy size={560} />
          <div style={{ position: "absolute", right: -40, top: -30, background: C.yellow, color: C.bg, fontSize: 48, fontWeight: 800, padding: "8px 24px", borderRadius: 14, transform: "rotate(10deg)" }}>₹ अनक्लेम्ड</div>
        </div>
        <Stamp text="जाल!" at={n.from + 6} size={110} style={{ left: 340, top: 380 }} />
      </AbsoluteFill>
      <Flash at={n.from} color={C.red} />
      <Sfx name="slam" at={n.from + 4} />
    </Shake>
  );
};

/* Intro: Sharma ji at home, phone rings, he answers */
export const IntroScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const answer = cues[1].from - 4;
  const ring = frame > at(cues[0], 0.6) && frame < answer;
  return (
    <Cam dur={dur}>
      <Home>
        <Person look={LOOKS.sharma} expr={frame >= answer ? "neutral" : "happy"} talking={speaking(cues, "sharma", frame)} arm={frame >= answer ? "phoneEar" : "down"}
          width={560} style={{ position: "absolute", left: 260, top: 540 }} seed={31} />
      </Home>
      {ring && <div style={{ position: "absolute", right: 120, top: 620, fontSize: 70, fontWeight: 800, color: C.yellow, transform: `rotate(${Math.sin(frame) * 10}deg)` }}>ट्रिंग ट्रिंग!</div>}
      <NameTag name="शर्मा जी" sub="रिटायर्ड टीचर" at={6} style={{ left: 0, top: 260 }} />
      <Sfx name="buzz" at={at(cues[0], 0.6)} volume={0.8} />
    </Cam>
  );
};

/* Call: SMS with a link from the fake officer */
export const CallScene: V = ({ dur }) => (
  <Cam dur={dur} to={1.05}>
    <PhoneCloseup skin={LOOKS.sharma.skin}>
      <ChatHeader name="RBI अधिकारी?" sub="SMS" />
      <div style={{ display: "flex", flexDirection: "column", paddingTop: 34 }}>
        <ChatBubble at={6} text="आपके पुराने खाते में ₹ पड़े हैं।" />
        <ChatBubble at={Math.round(dur * 0.35)} text="यहाँ क्लिक करके निकालें:" />
        <ChatBubble at={Math.round(dur * 0.55)} text="paisa-wapas.xyz/claim" />
      </div>
    </PhoneCloseup>
    <Stamp text="नकली लिंक" at={Math.round(dur * 0.7)} style={{ left: 520, top: 1000 }} size={60} />
    <Sfx name="ping" at={6} />
    <Sfx name="ping" at={Math.round(dur * 0.55)} />
  </Cam>
);

/* Bonus: policy with a BONUS stamp and "today only" */
export const BonusScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E293B, #0A0E1A 80%)" }}>
      <PopCard at={0} style={{ position: "absolute", left: 300, top: 300 }}><PolicyDoc width={480} /></PopCard>
      <Stamp text="बोनस ₹₹₹" at={Math.round(dur * 0.25)} color={C.green} size={80} style={{ left: 330, top: 620 }} />
      <PopCard at={Math.round(dur * 0.55)} style={{ position: "absolute", left: 120, top: 1020 }}>
        <div style={{ background: C.red, color: "#fff", fontSize: 54, fontWeight: 800, padding: "12px 30px", borderRadius: 18 }}>
          फीस: ₹ {(1999 + Math.floor(frame / 3) % 2).toLocaleString("en-IN")} — "बस थोड़ी सी"
        </div>
      </PopCard>
      <Sfx name="slam" at={Math.round(dur * 0.25)} volume={0.6} />
    </AbsoluteFill>
  );
};

/* Pressure: cards slam in, Sharma ji panics */
export const PressureScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  const times = [at(n, 0), at(n, 0.35), at(n, 0.7)];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 30%, #450A0A, #0A0E1A 80%)" }}>
      <div style={{ position: "absolute", top: 200, left: 90, right: 90 }}>
        <PressureCard text="आज ही!" at={times[0]} rotate={-3} />
        <PressureCard text="पॉलिसी रद्द होगी!" at={times[1]} rotate={2} />
        <PressureCard text="फॉर्म क्लियरेंस बाकी!" at={times[2]} rotate={-2} />
      </div>
      <Person look={LOOKS.sharma} expr="worried" talking={speaking(cues, "sharma", frame)} arm="phoneEar" width={480} style={{ position: "absolute", left: 300, top: 760 }} seed={32} />
      <div style={{ position: "absolute", top: 760, right: 60, fontSize: 60, fontWeight: 800, color: C.yellow, opacity: interpolate(frame, [cues[1].from, cues[1].from + 6], [0, 1], clamp) }}>जल्दी करो = जाल</div>
      {times.map((t) => <Sfx key={t} name="slam" at={t} volume={0.5} />)}
    </AbsoluteFill>
  );
};

/* Trap: UPI link, QR, remote app – all crossed; phone taken over */
export const TrapScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  const t = [at(n, 0.05), at(n, 0.25), at(n, 0.45)];
  const takeover = at(n, 0.7);
  const cx = interpolate(frame, [takeover, takeover + 40], [200, 760], clamp);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E293B, #0A0E1A 80%)" }}>
      <div style={{ position: "absolute", top: 220, left: 120, right: 120, display: "flex", flexDirection: "column", gap: 26 }}>
        <ChipX text="UPI लिंक" at={t[0]} />
        <ChipX text="QR कोड" at={t[1]} />
        <ChipX text="स्क्रीन-शेयर ऐप" at={t[2]} />
      </div>
      {frame >= takeover - 4 && (
        <PopCard at={takeover - 4} style={{ position: "absolute", left: 140, top: 760 }}>
          <div style={{ width: 800, height: 420, background: "#0F172A", border: `6px solid ${C.red}`, borderRadius: 30, position: "relative", overflow: "hidden" }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.red, padding: 24 }}>⚠ फोन ठग के कंट्रोल में</div>
            {["बैंक ऐप", "UPI", "गैलरी"].map((a, i) => <div key={a} style={{ position: "absolute", left: 60 + i * 240, top: 170, width: 180, height: 140, borderRadius: 24, background: "#334155", fontSize: 36, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{a}</div>)}
            <svg width="60" height="80" style={{ position: "absolute", left: cx, top: 230 }}><path d="M5 5 L5 60 L20 46 L32 72 L42 67 L30 42 L50 42 Z" fill="#fff" stroke="#000" strokeWidth="3" /></svg>
          </div>
        </PopCard>
      )}
      {t.map((x) => <Sfx key={x} name="pop" at={x + 10} />)}
      <Sfx name="whoosh" at={takeover} />
    </AbsoluteFill>
  );
};

/* Save: granddaughter stops him; the real portal */
export const SaveScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  if (frame < n.from - 2) {
    const enter = interpolate(frame, [0, 10], [0, 1], { ...clamp, easing: (t) => 1 - (1 - t) ** 3 });
    return (
      <Home>
        <Person look={LOOKS.sharma} expr="shock" arm="phone" width={480} style={{ position: "absolute", left: 40, top: 600 }} seed={33} />
        <Person look={LOOKS.pinky} expr="worried" talking={speaking(cues, "pinky", frame)} arm="point" width={460}
          style={{ position: "absolute", right: 40, top: 600, transform: `translateX(${(1 - enter) * 600}px) scaleX(-1)` }} seed={34} />
        <NameTag name="पिंकी" sub="शर्मा जी की पोती" at={4} style={{ left: 0, top: 260 }} />
        <Sfx name="whoosh" at={0} />
      </Home>
    );
  }
  const l = n.from;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #14532D, #0A0E1A 80%)" }}>
      <PopCard at={l} style={{ position: "absolute", left: 90, top: 300 }}>
        <BrowserCard url="udgam.rbi.org.in" title="अनक्लेम्ड पैसा सिर्फ़ यहाँ देखें" />
      </PopCard>
      <PopCard at={at(n, 0.55)} from="up" style={{ position: "absolute", left: 120, right: 120, top: 760 }}>
        <div style={{ background: "rgba(22,30,51,0.96)", border: `4px solid ${C.border}`, borderRadius: 28, padding: "26px 30px", fontSize: 50, fontWeight: 800, textAlign: "center", lineHeight: 1.3 }}>
          RBI फोन पर <span style={{ color: C.red }}>OTP / पासवर्ड</span><br />कभी नहीं माँगता
        </div>
      </PopCard>
      <Sfx name="pop" at={l} />
      <Sfx name="pop" at={at(n, 0.55)} />
    </AbsoluteFill>
  );
};

export const Steps: V = (p) => (
  <StepsScene {...p} look={LOOKS.sharma} who="sharma" steps={["लिंक मत खोलो", "पेमेंट मत करो", "बीमा कंपनी का आधिकारिक नंबर"]} />
);

export const SOURCE = "स्रोत: हैदराबाद साइबर पुलिस (UDGAM दुरुपयोग), मुंबई साइबर पुलिस (बीमा स्कैम) · शिकायत: 1930 या cybercrime.gov.in · कहानी काल्पनिक है";

export const Outro: V = (p) => (
  <OutroScene {...p} look={LOOKS.sharma} who="sharma" source={SOURCE}
    audiences={[{ label: "दादा-दादी", looks: [LOOKS.granny, LOOKS.dad] }, { label: "परिवार", looks: [LOOKS.mom, LOOKS.pinky] }]} />
);
