// Episode 4 – Fake IPO / "institutional account" groups: Amit's story
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { LOOKS, Person } from "../characters";
import { CrossMark, Magnifier } from "../icons";
import { Flash, NameTag, OutroScene, PopCard, Shake, Stamp, StepsScene, clamp, usePop } from "../kit";
import { GroupHeader, ProfitShot, TradingApp } from "../props";
import { Cam, ChatBubble, Desk, Notification, PhoneCloseup, Room } from "../sets";
import { Sfx } from "../Sfx";
import { C } from "../theme";
import { at, speaking } from "../timeline";
import type { SceneProps } from "../types";

type V = React.FC<SceneProps>;

const Banner: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{ margin: "26px 26px 10px", background: "linear-gradient(90deg,#F59E0B,#FACC15)", color: C.bg, borderRadius: 24, padding: "22px 20px", textAlign: "center",
    fontSize: 48, fontWeight: 800, lineHeight: 1.2, transform: `scale(${1 + Math.sin(frame * 0.3) * 0.03})`, boxShadow: "0 0 40px rgba(250,204,21,0.5)" }}>
    100% IPO अलॉटमेंट<br />गारंटी!
  </div>
);

/* Hook: the "guaranteed IPO" banner, then crossed out */
export const HookScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[1];
  const x = interpolate(frame, [n.from + 2, n.from + 14], [0, 1], clamp);
  return (
    <Shake at={n.from + 4}>
      <Cam to={1.08} dur={n.to}>
        <PhoneCloseup>
          <GroupHeader name="IPO किंग्स" members={Math.round(interpolate(frame, [0, n.from], [12400, 18900], clamp))} />
          <Banner frame={frame} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <ChatBubble at={10} text="जल्दी जुड़िए! सीटें सीमित!" />
            <ProfitShot pct="+340%" />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 160, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
            <CrossMark size={420} progress={x} />
          </div>
        </PhoneCloseup>
      </Cam>
      <Flash at={n.from + 4} color={C.red} />
      <Sfx name="ping" at={10} />
      <Sfx name="slam" at={n.from + 6} />
    </Shake>
  );
};

/* Intro: Amit at his desk gets added to a group */
export const IntroScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const add = at(cues[0], 0.55);
  return (
    <Cam dur={dur}>
      <Room>
        <Person look={LOOKS.amit} expr={frame > add ? "happy" : "neutral"} arm="phone" width={560} style={{ position: "absolute", left: 260, top: 400 }} seed={41} />
        <Desk />
      </Room>
      <div style={{ position: "absolute", top: 420, left: 90, right: 90 }}>
        <Notification at={add} title="व्हाट्सऐप" body="आपको 'IPO किंग्स' ग्रुप में जोड़ा गया" color={C.green} icon="+" />
      </div>
      <NameTag name="अमित" sub="शेयर मार्केट में नया" at={6} style={{ left: 0, top: 200 }} />
      <Sfx name="ping" at={add} />
    </Cam>
  );
};

/* Group: members grow, the "expert" posts screenshots, Amit is impressed */
export const GroupScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const amitLine = cues[1].from;
  return (
    <AbsoluteFill>
      <Cam dur={dur} to={1.04}>
        <PhoneCloseup skin={LOOKS.amit.skin}>
          <GroupHeader name="IPO किंग्स" members={Math.round(interpolate(frame, [0, dur], [18900, 24500]))} />
          <div style={{ display: "flex", flexDirection: "column", paddingTop: 20 }}>
            <ChatBubble at={4} text="एक्सपर्ट: सस्ते में IPO और ब्लॉक डील!" />
            <ProfitShot pct="+210%" />
            <ChatBubble at={Math.round(cues[0].to * 0.7)} text="मेंबर: थैंक्यू सर, आज 2 लाख कमाए!" />
            <ChatBubble at={amitLine} text="मुझे भी जोड़ लो!" mine />
          </div>
        </PhoneCloseup>
      </Cam>
      <div style={{ position: "absolute", left: 10, top: 960, width: 260, height: 360, overflow: "hidden", borderRadius: 30, border: `4px solid ${C.red}`, background: "#2A1B3D" }}>
        <Person look={LOOKS.expert} expr="grin" talking={speaking(cues, "expert", frame)} arm="point" width={240} style={{ position: "absolute", left: 10, top: 20 }} seed={42} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: C.red, fontSize: 30, fontWeight: 800, textAlign: "center", padding: 4 }}>"एक्सपर्ट"</div>
      </div>
      <Sfx name="ping" at={4} />
      <Sfx name="pop" at={amitLine} />
    </AbsoluteFill>
  );
};

/* Words: SEBI-flagged phrases flip in */
export const WordsScene: V = ({ cues }) => {
  const n = cues[0];
  const words = ["इंस्टीट्यूशनल अकाउंट", "डिस्काउंट पर IPO", "सस्ते में ब्लॉक ट्रेड"];
  const times = [at(n, 0.38), at(n, 0.58), at(n, 0.78)];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 35%, #422006, #0A0E1A 80%)", alignItems: "center" }}>
      <PopCard at={0} style={{ marginTop: 220 }}>
        <div style={{ background: C.yellow, color: C.bg, fontSize: 56, fontWeight: 800, padding: "12px 36px", borderRadius: 18 }}>⚠ सेबी की चेतावनी वाले शब्द</div>
      </PopCard>
      <div style={{ marginTop: 60, display: "flex", flexDirection: "column", gap: 30, width: 880 }}>
        {words.map((w, i) => <FlipCard key={w} text={w} at={times[i]} />)}
      </div>
      {times.map((t) => <Sfx key={t} name="pop" at={t} />)}
    </AbsoluteFill>
  );
};

const FlipCard: React.FC<{ text: string; at: number }> = ({ text, at: a }) => {
  const frame = useCurrentFrame();
  const r = interpolate(frame, [a, a + 10], [90, 0], clamp);
  return (
    <div style={{ background: "rgba(22,30,51,0.96)", border: `5px solid ${C.red}`, borderRadius: 26, padding: "28px 30px", fontSize: 62, fontWeight: 800, textAlign: "center",
      transform: `perspective(800px) rotateX(${r}deg)`, opacity: frame < a ? 0 : 1 }}>
      "{text}"
    </div>
  );
};

/* App: profits rising on screen – only numbers */
export const AppScene: V = ({ dur, cues }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  const prog = interpolate(frame, [at(n, 0.3), dur], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Cam dur={dur} to={1.05}>
        <PhoneCloseup skin={LOOKS.amit.skin}>
          {frame < at(n, 0.3) ? (
            <div style={{ position: "absolute", inset: 0, background: "#0B1220", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 200, height: 200, borderRadius: 50, background: "linear-gradient(135deg,#22C55E,#0EA5E9)", fontSize: 100, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>₹</div>
              <div style={{ fontSize: 50, fontWeight: 800, marginTop: 30 }}>"प्रो ट्रेडर" ऐप</div>
              <div style={{ width: 400, height: 20, borderRadius: 10, background: "#334155", marginTop: 30, overflow: "hidden" }}>
                <div style={{ width: `${interpolate(frame, [0, at(n, 0.3)], [0, 100], clamp)}%`, height: "100%", background: C.green }} />
              </div>
              <div style={{ fontSize: 32, color: C.muted, marginTop: 10 }}>डाउनलोड हो रहा है...</div>
            </div>
          ) : (
            <TradingApp balance={interpolate(prog, [0, 1], [50000, 385000])} progress={prog} />
          )}
        </PhoneCloseup>
      </Cam>
      <Stamp text="सिर्फ़ स्क्रीन का आँकड़ा" at={at(n, 0.8)} color={C.yellow} size={56} style={{ left: 160, top: 1040 }} />
      <Sfx name="pop" at={at(n, 0.3)} />
    </AbsoluteFill>
  );
};

/* Withdraw: button greys out, a new fee pops up */
export const WithdrawScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const press = 6;
  const popup = usePop(14, 11);
  const n = cues[1];
  const state = frame < press ? "idle" : frame < press + 4 ? "pressed" : "blocked";
  if (frame >= n.from - 2) {
    return (
      <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E293B, #0A0E1A 80%)" }}>
        <div style={{ position: "absolute", left: 140, top: 420, width: 260, height: 260, borderRadius: 50, background: "linear-gradient(135deg,#22C55E,#0EA5E9)", fontSize: 120, fontWeight: 800,
          display: "flex", alignItems: "center", justifyContent: "center" }}>₹</div>
        <div style={{ position: "absolute", left: 160, top: 700, fontSize: 44, fontWeight: 800 }}>"प्रो ट्रेडर" ऐप</div>
        <ArrowLabel x={430} y={440} text="पैसा अंदर" ok />
        <ArrowLabel x={430} y={600} text="बाहर" ok={false} />
        <Person look={LOOKS.amit} expr="sad" arm="down" width={400} style={{ position: "absolute", left: 340, top: 820 }} seed={43} />
        <Sfx name="slam" at={n.from + 6} volume={0.5} />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill>
      <PhoneCloseup skin={LOOKS.amit.skin}>
        <TradingApp balance={385000} progress={1} withdraw={state} />
        {frame >= 14 && (
          <div style={{ position: "absolute", left: 30, right: 30, top: 380, background: "#fff", color: C.bg, borderRadius: 30, padding: 34, transform: `scale(${popup})`, boxShadow: "0 20px 60px rgba(0,0,0,0.7)" }}>
            <div style={{ fontSize: 46, fontWeight: 800, color: C.red }}>निकासी रुकी है</div>
            <div style={{ fontSize: 40, fontWeight: 700, marginTop: 12, lineHeight: 1.3 }}>पहले "टैक्स" और "प्रोसेसिंग फीस" जमा करें</div>
            <div style={{ marginTop: 22, background: C.red, color: "#fff", fontSize: 40, fontWeight: 800, textAlign: "center", padding: 16, borderRadius: 18 }}>अभी भुगतान करें</div>
          </div>
        )}
      </PhoneCloseup>
      <div style={{ position: "absolute", left: 30, top: 900, width: 330, height: 480, overflow: "hidden" }}>
        <Person look={LOOKS.amit} expr="shock" talking={speaking(cues, "amit", frame)} arm="cheek" width={320} style={{ position: "absolute", left: 0, top: 0 }} seed={44} />
      </div>
      <Sfx name="pop" at={press} />
      <Sfx name="ping" at={14} />
    </AbsoluteFill>
  );
};

const ArrowLabel: React.FC<{ x: number; y: number; text: string; ok: boolean }> = ({ x, y, text, ok }) => {
  const p = usePop(ok ? 0 : 14, 12);
  return (
    <div style={{ position: "absolute", left: x, top: y, display: "flex", alignItems: "center", gap: 20, opacity: p, transform: `translateX(${(1 - p) * 100}px)` }}>
      <svg width="260" height="80"><line x1={ok ? 250 : 10} y1="40" x2={ok ? 30 : 230} y2="40" stroke={ok ? C.green : C.red} strokeWidth="14" strokeLinecap="round" />
        <polygon points={ok ? "10,40 50,15 50,65" : "250,40 210,15 210,65"} fill={ok ? C.green : C.red} /></svg>
      <div style={{ fontSize: 56, fontWeight: 800, color: ok ? C.green : C.red }}>{text}</div>
      {!ok && <CrossMark size={90} progress={1} />}
    </div>
  );
};

/* Check: SEBI registration with a magnifier */
export const CheckScene: V = ({ cues }) => {
  const frame = useCurrentFrame();
  const n = cues[0];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #14532D, #0A0E1A 80%)", alignItems: "center" }}>
      <PopCard at={0} style={{ marginTop: 230 }}>
        <div style={{ background: "rgba(22,30,51,0.96)", border: `4px solid ${C.border}`, borderRadius: 28, padding: "24px 34px", fontSize: 48, fontWeight: 800, textAlign: "center", lineHeight: 1.3, width: 860 }}>
          आम भारतीय निवासी<br /><span style={{ color: C.red }}>FPI रूट</span> से निवेश नहीं कर सकते
        </div>
      </PopCard>
      <PopCard at={at(n, 0.55)} from="up" style={{ marginTop: 50, position: "relative" }}>
        <div style={{ width: 860, background: "#F8FAFC", color: C.bg, borderRadius: 30, padding: "30px 36px" }}>
          <div style={{ fontSize: 50, fontWeight: 800 }}>पैसे लगाने से पहले जाँचें:</div>
          {["SEBI रजिस्ट्रेशन नंबर", "रजिस्टर्ड ब्रोकर का आधिकारिक ऐप"].map((t, i) => (
            <div key={t} style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 44, fontWeight: 700, marginTop: 20, opacity: interpolate(frame, [at(n, 0.65) + i * 10, at(n, 0.65) + i * 10 + 6], [0, 1], clamp) }}>
              <span style={{ width: 60, height: 60, borderRadius: 99, background: C.green, color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>✓</span>{t}
            </div>
          ))}
        </div>
        <Magnifier size={200} color={C.yellow} style={{ position: "absolute", right: -40, top: -90, transform: `rotate(${Math.sin(frame * 0.12) * 12}deg)` }} />
      </PopCard>
      <Sfx name="pop" at={at(n, 0.55)} />
    </AbsoluteFill>
  );
};

export const Steps: V = (p) => (
  <StepsScene {...p} look={LOOKS.amit} who="amit" steps={["SEBI रजिस्टर्ड ऐप ही", "गारंटी वाले ऑफ़र से दूर", "ठगी हो तो तुरंत कॉल"]} />
);

export const SOURCE = "स्रोत: SEBI चेतावनी, फर्जी ट्रेडिंग ऐप और IPO ऑफ़र (Business Standard, अगस्त 2025) · यह निवेश सलाह नहीं, सुरक्षा जानकारी है · कहानी काल्पनिक है";

export const Outro: V = (p) => (
  <OutroScene {...p} look={LOOKS.amit} who="amit" source={SOURCE}
    audiences={[{ label: "नए निवेशक दोस्त", looks: [LOOKS.friend1, LOOKS.friend2] }, { label: "कॉलेज ग्रुप", looks: [LOOKS.rahul, LOOKS.priya] }]} />
);
