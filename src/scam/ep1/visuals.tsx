// Episode 1 – Mule account trap: story scenes starring Rahul
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LOOKS, Person } from "../characters";
import { CrossMark, FollowButton, ShareArrow } from "../icons";
import { Bars, Cam, Cell, ChatBubble, ChatHeader, Desk, Home, Notification, PhoneCloseup, Room, Station, Table } from "../sets";
import { Sfx } from "../Sfx";
import { C } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
type V = React.FC<{ dur: number }>;

const usePop = (delay: number, damping = 12) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

const Shake: React.FC<{ at: number; children: React.ReactNode; amt?: number }> = ({ at, children, amt = 2.5 }) => {
  const frame = useCurrentFrame();
  const k = frame >= at && frame < at + 12 ? (at + 12 - frame) * amt : 0;
  return <AbsoluteFill style={{ transform: `translate(${Math.sin(frame * 3.1) * k}px, ${Math.cos(frame * 2.3) * k}px)` }}>{children}</AbsoluteFill>;
};

const Flash: React.FC<{ at: number; color?: string }> = ({ at, color = "#fff" }) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{ background: color, opacity: interpolate(frame, [at, at + 2, at + 10], [0, 0.7, 0], clamp), pointerEvents: "none" }} />;
};

const Stamp: React.FC<{ text: string; at: number; color?: string; style?: React.CSSProperties; size?: number }> = ({ text, at, color = C.red, style, size = 70 }) => {
  const p = usePop(at, 9);
  if (p <= 0.001) return null;
  return (
    <div style={{ position: "absolute", border: `8px solid ${color}`, color, fontSize: size, fontWeight: 800, padding: "0 28px", borderRadius: 16,
      background: "rgba(10,14,26,0.85)", transform: `rotate(-10deg) scale(${interpolate(p, [0, 1], [2.2, 1])})`, opacity: Math.min(1, p * 2), ...style }}>
      {text}
    </div>
  );
};

const NameTag: React.FC<{ name: string; sub: string; at: number; style?: React.CSSProperties }> = ({ name, sub, at, style }) => {
  const p = usePop(at, 14);
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

const LockScreen: React.FC<{ at: number }> = ({ at }) => (
  <AbsoluteFill style={{ background: "linear-gradient(160deg,#312E81,#0F172A)" }}>
    <div style={{ marginTop: 150, textAlign: "center", fontSize: 150, fontWeight: 700, lineHeight: 1 }}>11:47</div>
    <div style={{ textAlign: "center", fontSize: 38, color: "#C7D2FE", marginBottom: 60 }}>गुरुवार, रात</div>
    <Notification at={at} title="अनजान नंबर · अभी" body="खाता रेंट पर दो, कमीशन आपका" icon="?" color="#64748B" />
  </AbsoluteFill>
);

/* 1. Hook: phone close-up with the offer, then Rahul behind bars */
export const HookScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const cut = Math.round(dur * 0.48);
  return (
    <AbsoluteFill>
      {frame < cut ? (
        <Cam to={1.12} dur={cut} origin="50% 35%">
          <PhoneCloseup>
            <LockScreen at={6} />
          </PhoneCloseup>
        </Cam>
      ) : (
        <Shake at={cut + 7} amt={3}>
          <Cell>
            <Person look={LOOKS.rahul} expr="sad" width={600} style={{ position: "absolute", left: 240, top: 430 }} seed={1} headTilt={-4} />
          </Cell>
          <Bars at={cut} />
        </Shake>
      )}
      <Flash at={cut} />
      <Sfx name="ping" at={6} />
      <Sfx name="whoosh" at={cut - 6} volume={0.6} />
      <Sfx name="slam" at={cut + 6} />
    </AbsoluteFill>
  );
};

/* 2. Rahul at his desk at night, phone buzzes */
export const RoomScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const buzzAt = Math.round(dur * 0.45);
  const pick = Math.round(dur * 0.78);
  const picked = frame >= pick;
  return (
    <Cam dur={dur}>
      <Room>
        <Person look={LOOKS.rahul} expr={picked ? "neutral" : frame > buzzAt ? "worried" : "neutral"} arm={picked ? "phone" : "down"}
          width={560} style={{ position: "absolute", left: 260, top: 400 }} seed={2} headTilt={frame > buzzAt && !picked ? 6 : 0} />
        <Desk phoneOnDesk={!picked} buzz={frame > buzzAt && !picked} />
      </Room>
      <NameTag name="राहुल" sub="कॉलेज स्टूडेंट" at={8} style={{ left: 0, top: 260 }} />
      <Sfx name="buzz" at={buzzAt} volume={0.7} />
    </Cam>
  );
};

/* 3. The chat on Rahul's phone */
export const ChatScene: V = ({ dur }) => {
  const t = (f: number) => Math.round(dur * f);
  const times = [t(0.06), t(0.24), t(0.42), t(0.78)];
  return (
    <Cam dur={dur} to={1.05}>
      <PhoneCloseup>
        <ChatHeader name="अनजान नंबर" />
        <div style={{ display: "flex", flexDirection: "column", paddingTop: 34 }}>
          <ChatBubble at={times[0]} text="हैलो राहुल! घर बैठे कमाई करोगे?" />
          <ChatBubble at={times[1]} text="आपके खाते में पैसा आएगा, बस आगे भेज देना" />
          <ChatBubble at={times[2]} text="बदले में कमीशन आपका" />
          <ChatBubble at={times[3]} text="ठीक है, डील!" mine />
        </div>
      </PhoneCloseup>
      {times.map((at, i) => <Sfx key={i} name={i === 3 ? "pop" : "ping"} at={at} volume={0.6} />)}
    </Cam>
  );
};

/* 4. Money comes in, goes out, Rahul is happy */
export const EasyMoneyScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = (f: number) => Math.round(dur * f);
  return (
    <Cam dur={dur} to={1.04}>
      <Room>
        <Person look={LOOKS.rahul} expr="happy" arm="phone" width={560} style={{ position: "absolute", left: 260, top: 400 }} seed={3} headTilt={Math.sin(frame * 0.2) * 4} />
        <Desk />
        {[0, 1, 2, 3, 4].map((i) => {
          const y = interpolate((frame + i * 20) % 60, [0, 60], [1000, 700]);
          return <div key={i} style={{ position: "absolute", left: 300 + i * 110, top: y, width: 56, height: 56, borderRadius: 99, background: C.yellow, color: C.bg, fontSize: 36, fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center", opacity: interpolate((frame + i * 20) % 60, [0, 10, 50, 60], [0, 1, 1, 0]) }}>₹</div>;
        })}
      </Room>
      <div style={{ position: "absolute", top: 180, left: 120, right: 120 }}>
        <Notification at={t(0.03)} title="बैंक" body="+ ₹ आपके खाते में जमा" color={C.green} />
        <Notification at={t(0.3)} title="बैंक" body="− ₹ आगे भेजे गए" color={C.red} icon="↗" />
        <Notification at={t(0.55)} title="बैंक" body="+ ₹ कमीशन मिला" color={C.yellow} />
      </div>
      {[0.03, 0.3, 0.55].map((f) => <Sfx key={f} name="ping" at={t(f)} volume={0.5} />)}
    </Cam>
  );
};

/* 5. Reveal: victim -> Rahul -> scammer */
const Panel: React.FC<{ x: number; y: number; at: number; bg: string; label: string; labelColor: string; children: React.ReactNode }> = ({ x, y, at, bg, label, labelColor, children }) => {
  const p = usePop(at, 13);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 560, opacity: p, transform: `scale(${interpolate(p, [0, 1], [0.7, 1])})` }}>
      <div style={{ position: "relative", height: 330, borderRadius: 36, overflow: "hidden", background: bg, border: `6px solid ${labelColor}` }}>{children}</div>
      <div style={{ marginTop: 10, fontSize: 44, fontWeight: 800, color: labelColor, textAlign: "center" }}>{label}</div>
    </div>
  );
};

export const RevealScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = (f: number) => Math.round(dur * f);
  const pts = [[400, 420], [680, 800], [400, 1180]];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 50%, #1E293B, #0A0E1A 80%)" }}>
      <svg width={1080} height={1400} style={{ position: "absolute" }}>
        <path d={`M${pts[0][0]} ${pts[0][1]} Q 900 520 ${pts[1][0]} ${pts[1][1]} Q 200 980 ${pts[2][0]} ${pts[2][1]}`} fill="none" stroke="#334155" strokeWidth="12"
          strokeDasharray="24 18" strokeDashoffset={-frame * 3} opacity={interpolate(frame, [t(0.12), t(0.2)], [0, 1], clamp)} />
      </svg>
      <Panel x={60} y={180} at={0} bg="#5B3A4A" label="किसी का लूटा पैसा" labelColor="#F9A8D4">
        <Person look={LOOKS.granny} expr="sad" arm="phone" width={300} style={{ position: "absolute", left: 130, top: 20 }} seed={4} />
      </Panel>
      <Panel x={460} y={560} at={t(0.15)} bg="#22304F" label="राहुल का खाता" labelColor={C.yellow}>
        <Person look={LOOKS.rahul} expr="happy" arm="phone" width={300} style={{ position: "absolute", left: 130, top: 20 }} seed={5} />
      </Panel>
      <Panel x={60} y={940} at={t(0.3)} bg="#111318" label="ठग" labelColor={C.red}>
        <Person look={LOOKS.scammer} expr="evil" arm="cross" width={300} style={{ position: "absolute", left: 130, top: 20 }} seed={6} />
      </Panel>
      {/* coins following the path */}
      {[0, 1, 2, 3].map((i) => {
        const start = t(0.2) + i * 14;
        if (frame < start) return null;
        const u = ((frame - start) % 60) / 60;
        const seg = u < 0.5 ? 0 : 1;
        const lu = (u % 0.5) * 2;
        const ctrl = seg === 0 ? [900, 520] : [200, 980];
        const a = pts[seg], b = pts[seg + 1];
        const x = (1 - lu) ** 2 * a[0] + 2 * (1 - lu) * lu * ctrl[0] + lu ** 2 * b[0];
        const y = (1 - lu) ** 2 * a[1] + 2 * (1 - lu) * lu * ctrl[1] + lu ** 2 * b[1];
        return <div key={i} style={{ position: "absolute", left: x - 32, top: y - 32, width: 64, height: 64, borderRadius: 99, background: C.yellow, color: C.bg, fontSize: 40, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 20px rgba(0,0,0,0.5)" }}>₹</div>;
      })}
      <Stamp text="म्यूल अकाउंट" at={t(0.62)} style={{ left: 520, top: 520 }} size={64} />
      <Sfx name="slam" at={t(0.62)} volume={0.5} />
    </AbsoluteFill>
  );
};

/* 6. Account frozen, then a knock: police at the door */
export const FrozenScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = (f: number) => Math.round(dur * f);
  const knock = t(0.45);
  const door = interpolate(frame, [knock + 22, knock + 40], [0, 1], clamp);
  const ice = interpolate(frame, [t(0.08), t(0.2)], [0, 1], clamp);
  return (
    <Cam dur={dur} to={1.04} origin="70% 50%">
      <Room door={door}>
        {door > 0.05 && <Person look={LOOKS.police} expr="stern" arm="cross" width={300} style={{ position: "absolute", right: 60, top: 600 }} seed={7} />}
        <Person look={LOOKS.rahul} expr="shock" arm={frame < knock ? "phone" : "cheek"} width={540} style={{ position: "absolute", left: 60, top: 430 }} seed={8}
          headTilt={frame > knock ? 8 : 0} />
        <Desk laptop={false} lamp={false} />
      </Room>
      {/* frozen alert */}
      <div style={{ position: "absolute", left: 90, right: 90, top: 190, opacity: interpolate(frame, [t(0.04), t(0.1), knock - 5, knock + 5], [0, 1, 1, 0], clamp) }}>
        <div style={{ position: "relative", background: "rgba(30,41,59,0.97)", borderRadius: 34, padding: "26px 34px", border: "4px solid #BAE6FD", overflow: "hidden" }}>
          <div style={{ fontSize: 34, color: C.muted, fontWeight: 700 }}>बैंक अलर्ट</div>
          <div style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.2 }}>आपका खाता फ्रीज़ कर दिया गया है</div>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(186,230,253,0.45), rgba(56,189,248,0.15))", opacity: ice }} />
        </div>
      </div>
      {frame >= knock && frame < knock + 30 && (
        <div style={{ position: "absolute", right: 80, top: 420, fontSize: 80, fontWeight: 800, color: C.yellow, transform: `rotate(-8deg) scale(${1 + Math.sin(frame) * 0.05})`, textShadow: "0 4px 0 #000" }}>ठक! ठक!</div>
      )}
      <Sfx name="pop" at={t(0.05)} />
      <Sfx name="knock" at={knock} />
    </Cam>
  );
};

/* 7. Police station: "मुझे नहीं पता था", then lock-up */
export const StationScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const cut = Math.round(dur * 0.55);
  const bubble = usePop(6, 12);
  if (frame >= cut) {
    return (
      <Shake at={cut + 7}>
        <Cell>
          <Person look={LOOKS.rahul} expr="sad" width={600} style={{ position: "absolute", left: 240, top: 430 }} seed={9} headTilt={-6} />
        </Cell>
        <Bars at={cut} />
        <Sfx name="slam" at={cut + 6} />
      </Shake>
    );
  }
  return (
    <Cam dur={cut} to={1.05}>
      <Station>
        <Person look={LOOKS.police} expr="stern" arm="cross" width={470} style={{ position: "absolute", left: 20, top: 500 }} seed={10} />
        <Person look={LOOKS.rahul} expr="worried" talking={frame > 6 && frame < cut * 0.45} arm="cheek" width={470} style={{ position: "absolute", right: 20, top: 520 }} seed={11} />
        <Table />
      </Station>
      <div style={{ position: "absolute", right: 70, top: 290, transform: `scale(${bubble})`, transformOrigin: "80% 100%" }}>
        <div style={{ background: "#fff", color: C.bg, fontSize: 58, fontWeight: 800, padding: "22px 40px", borderRadius: 40, borderBottomRightRadius: 6 }}>मुझे नहीं पता था!</div>
      </div>
      <Stamp text="बचाव नहीं" at={Math.round(cut * 0.55)} style={{ left: 60, top: 300 }} />
    </Cam>
  );
};

/* 8. The right way: block & report, never share account/card/OTP/PIN */
export const RightWayScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const cut = Math.round(dur * 0.42);
  const tap = Math.round(cut * 0.55);
  if (frame < cut) {
    const blocked = frame >= tap + 4;
    return (
      <AbsoluteFill>
        <PhoneCloseup>
          <ChatHeader name="अनजान नंबर" sub={blocked ? "ब्लॉक किया गया" : "online"} />
          <div style={{ display: "flex", flexDirection: "column", paddingTop: 34 }}>
            <ChatBubble at={0} text="खाता रेंट पर दो, कमीशन आपका" />
          </div>
          <div style={{ position: "absolute", left: 40, right: 40, bottom: 80, background: blocked ? C.green : C.red, borderRadius: 30, padding: "26px 0", textAlign: "center", fontSize: 50, fontWeight: 800,
            transform: `scale(${frame >= tap && frame < tap + 4 ? 0.94 : 1})` }}>
            {blocked ? "✓ ब्लॉक और रिपोर्ट हो गया" : "ब्लॉक और रिपोर्ट करें"}
          </div>
          {frame >= tap - 6 && frame < tap + 12 && (
            <div style={{ position: "absolute", left: "50%", bottom: 110, width: 60, height: 60, marginLeft: -30, borderRadius: 99, border: "6px solid #fff",
              transform: `scale(${interpolate(frame, [tap, tap + 12], [0.6, 2.4], clamp)})`, opacity: interpolate(frame, [tap, tap + 12], [1, 0], clamp) }} />
          )}
        </PhoneCloseup>
        <div style={{ position: "absolute", top: 160, left: 0, right: 0, textAlign: "center" }}>
          <span style={{ background: C.green, color: C.bg, fontSize: 44, fontWeight: 800, padding: "8px 30px", borderRadius: 14 }}>सही तरीका</span>
        </div>
        <Sfx name="pop" at={tap} />
      </AbsoluteFill>
    );
  }
  const items = ["खाता", "डेबिट कार्ड", "OTP", "PIN"];
  return (
    <Cam dur={dur - cut} to={1.04}>
      <Room>
        <Person look={LOOKS.rahul} expr="grin" arm="cross" width={560} style={{ position: "absolute", left: 260, top: 420 }} seed={12} />
        <Desk laptop={false} />
      </Room>
      <div style={{ position: "absolute", top: 200, left: 60, right: 60, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 26 }}>
        {items.map((it, i) => (
          <Chip key={it} text={it} at={6 + i * 10} />
        ))}
      </div>
      {items.map((_, i) => <Sfx key={i} name="pop" at={cut * 0 + 6 + i * 10} volume={0.5} />)}
    </Cam>
  );
};

const Chip: React.FC<{ text: string; at: number }> = ({ text, at }) => {
  const frame = useCurrentFrame();
  const p = usePop(at, 12);
  const x = interpolate(frame, [at + 10, at + 20], [0, 1], clamp);
  return (
    <div style={{ position: "relative", background: "rgba(22,30,51,0.95)", border: `4px solid ${C.border}`, borderRadius: 26, padding: "18px 0", textAlign: "center",
      fontSize: 52, fontWeight: 800, transform: `scale(${p})` }}>
      {text}
      <div style={{ position: "absolute", right: 14, top: "50%", marginTop: -40 }}>
        <CrossMark size={80} progress={x} />
      </div>
    </div>
  );
};

/* 9. Three steps + call 1930 */
export const StepsScene: V = ({ dur }) => {
  const frame = useCurrentFrame();
  const t = (f: number) => Math.round(dur * f);
  const steps = ["ऑफ़र ठुकराओ", "पैसा आगे मत भेजो", "बैंक को बताओ"];
  const callAt = t(0.62);
  const call = usePop(callAt, 11);
  return (
    <Cam dur={dur} to={1.03}>
      <Room>
        <Person look={LOOKS.rahul} expr={frame >= callAt ? "neutral" : "happy"} talking={frame >= callAt + 10} arm={frame >= callAt ? "phoneEar" : "down"} width={520}
          style={{ position: "absolute", left: 120, top: 560 }} seed={13} />
        <Desk laptop={false} lamp={false} />
      </Room>
      <div style={{ position: "absolute", top: 180, left: 60, right: 60 }}>
        {steps.map((s, i) => (
          <Step key={s} n={i + 1} text={s} at={t(0.02 + i * 0.18)} />
        ))}
      </div>
      <div style={{ position: "absolute", left: 600, top: 650, transform: `scale(${call * (1 + Math.sin(frame * 0.3) * 0.04)})`, background: C.green, color: C.bg, borderRadius: 40, padding: "18px 36px", textAlign: "center",
        boxShadow: `0 0 40px ${C.green}` }}>
        <div style={{ fontSize: 34, fontWeight: 800 }}>ठगी हुई? कॉल करें</div>
        <div style={{ fontSize: 110, fontWeight: 800, lineHeight: 1 }}>1930</div>
      </div>
      {[0, 1, 2].map((i) => <Sfx key={i} name="pop" at={t(0.02 + i * 0.18)} volume={0.5} />)}
      <Sfx name="ping" at={callAt} />
    </Cam>
  );
};

const Step: React.FC<{ n: number; text: string; at: number }> = ({ n, text, at }) => {
  const p = usePop(at, 13);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 26, background: "rgba(22,30,51,0.95)", border: `4px solid ${C.border}`, borderRadius: 28, padding: "18px 28px",
      marginBottom: 20, opacity: p, transform: `translateX(${(1 - p) * -300}px)` }}>
      <div style={{ width: 80, height: 80, borderRadius: 99, background: C.green, color: C.bg, fontSize: 50, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{n}</div>
      <div style={{ fontSize: 56, fontWeight: 800 }}>{text}</div>
    </div>
  );
};

/* 10. Outro: share with friends & family, follow */
export const OutroScene: React.FC<{ dur: number; source: string }> = ({ dur, source }) => {
  const frame = useCurrentFrame();
  const t = (f: number) => Math.round(dur * f);
  const friends = usePop(t(0.1), 12);
  const family = usePop(t(0.22), 12);
  const follow = usePop(t(0.45), 10);
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #1E3A5F, #0A0E1A 80%)" }}>
      <Person look={LOOKS.rahul} expr="happy" arm="wave" width={430} style={{ position: "absolute", left: 325, top: 230 }} seed={14} />
      <ShareArrow size={150} color={C.yellow} style={{ position: "absolute", left: 200, top: 650, transform: `scaleX(-1) rotate(20deg) scale(${friends})` }} />
      <ShareArrow size={150} color={C.yellow} style={{ position: "absolute", right: 200, top: 650, transform: `rotate(20deg) scale(${family})` }} />
      <div style={{ position: "absolute", left: 10, top: 780, display: "flex", opacity: friends, transform: `scale(${friends})` }}>
        <Person look={LOOKS.friend1} expr="happy" width={200} seed={15} />
        <Person look={LOOKS.friend2} expr="happy" width={200} seed={16} style={{ marginLeft: -70 }} />
      </div>
      <div style={{ position: "absolute", right: 10, top: 780, display: "flex", opacity: family, transform: `scale(${family})` }}>
        <Person look={LOOKS.dad} expr="neutral" width={200} seed={17} />
        <Person look={LOOKS.mom} expr="happy" width={200} seed={18} style={{ marginLeft: -70 }} />
      </div>
      <div style={{ position: "absolute", left: 40, top: 1095, width: 320, textAlign: "center", fontSize: 42, fontWeight: 800, opacity: friends }}>दोस्त</div>
      <div style={{ position: "absolute", right: 40, top: 1095, width: 320, textAlign: "center", fontSize: 42, fontWeight: 800, opacity: family }}>घरवाले</div>
      <div style={{ position: "absolute", top: 1150, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: follow }}>
        <FollowButton scale={follow * (1 + Math.sin(frame * 0.25) * 0.06)} />
      </div>
      <div style={{ position: "absolute", top: 1690, left: 90, right: 150, textAlign: "center", fontSize: 28, color: C.muted, lineHeight: 1.35 }}>{source}</div>
      <Sfx name="whoosh" at={t(0.1)} volume={0.5} />
      <Sfx name="whoosh" at={t(0.22)} volume={0.5} />
      <Sfx name="pop" at={t(0.45)} />
    </AbsoluteFill>
  );
};
