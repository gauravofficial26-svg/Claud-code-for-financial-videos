// Episode 1 – Mule account trap: scene visuals
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { fade, pulse, usePop } from "../anim";
import { BankIcon, CrossMark, Handcuffs, Magnifier, PassbookIcon, PersonIcon, PriceTag, ShieldIcon } from "../icons";
import { Label, Stage } from "../Stage";
import { C } from "../theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/* 0-2 s: passbook with a price tag, red handcuffs slam over it */
export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drop = usePop(10, 9);
  const impact = 18;
  const shake = frame >= impact && frame < impact + 10 ? Math.sin(frame * 3) * (impact + 10 - frame) * 2 : 0;
  const flash = interpolate(frame, [impact, impact + 3, impact + 14], [0, 0.45, 0], clamp);
  return (
    <AbsoluteFill style={{ transform: `translate(${shake}px, ${shake * 0.6}px)` }}>
      <Stage>
        <div style={{ position: "relative" }}>
          <PassbookIcon size={340} />
          <PriceTag label="₹ किराया" size={300}
            style={{ position: "absolute", top: -40, right: -170, transform: `rotate(${12 + Math.sin(frame * 0.3) * 4}deg)` }} />
          <Handcuffs size={520}
            style={{ position: "absolute", left: -90, top: 150, transform: `translateY(${interpolate(drop, [0, 1], [-900, 0])}px) rotate(-8deg) scale(${interpolate(drop, [0, 1], [1.6, 1])})` }} />
        </div>
      </Stage>
      <AbsoluteFill style={{ background: C.red, opacity: flash }} />
    </AbsoluteFill>
  );
};

/* 2-8 s: chat bubbles on a generic messaging screen */
const Bubble: React.FC<{ text: string; at: number; mine?: boolean }> = ({ text, at, mine }) => {
  const frame = useCurrentFrame();
  const typing = frame >= at - 18 && frame < at;
  const p = usePop(at, 14);
  if (frame < at - 18) return null;
  return (
    <div style={{ alignSelf: mine ? "flex-end" : "flex-start", marginBottom: 22 }}>
      {typing ? (
        <div style={{ background: "#243049", borderRadius: 28, padding: "18px 28px", fontSize: 44, letterSpacing: 6, color: C.muted }}>
          {".".repeat(1 + (Math.floor(frame / 5) % 3))}
        </div>
      ) : (
        <div
          style={{
            background: mine ? "#14532D" : "#243049",
            borderRadius: 28,
            borderTopLeftRadius: mine ? 28 : 6,
            padding: "18px 28px",
            fontSize: 46,
            fontWeight: 700,
            maxWidth: 520,
            lineHeight: 1.3,
            transform: `scale(${p})`,
            transformOrigin: "left center",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export const ChatScene: React.FC = () => {
  const p = usePop(0);
  return (
    <Stage>
      <div
        style={{
          width: 640,
          height: 780,
          background: "#0F1626",
          border: `6px solid ${C.border}`,
          borderRadius: 60,
          overflow: "hidden",
          transform: `scale(${interpolate(p, [0, 1], [0.8, 1])})`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, padding: "28px 32px", background: C.panel }}>
          <div style={{ width: 76, height: 76, borderRadius: 999, background: C.muted, color: C.bg, fontSize: 48, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
            ?
          </div>
          <div>
            <div style={{ fontSize: 40, fontWeight: 800 }}>अनजान नंबर</div>
            <div style={{ fontSize: 28, color: C.green }}>online</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 32 }}>
          <Bubble at={22} text="आपके खाते में पैसा आएगा" />
          <Bubble at={62} text="बस आगे भेज दो" />
          <Bubble at={102} text="कमीशन तुम्हारा ₹₹₹" />
        </div>
      </div>
    </Stage>
  );
};

/* 8-15 s: stranger -> your account -> another account, your account highlighted */
const NODES = [
  { x: 170, label: "ठग", color: C.red },
  { x: 540, label: "आपका खाता", color: C.yellow },
  { x: 910, label: "दूसरा खाता", color: C.muted },
];
const NODE_Y = 420;

export const MoneyFlowScene: React.FC = () => {
  const frame = useCurrentFrame();
  const coins = [0, 1, 2, 3, 4, 5];
  return (
    <Stage style={{ justifyContent: "flex-start" }}>
      <div style={{ position: "relative", width: 1080, height: 800 }}>
        <svg width={1080} height={800} style={{ position: "absolute", inset: 0 }}>
          {[0, 1].map((i) => (
            <line key={i} x1={NODES[i].x + 95} y1={NODE_Y} x2={NODES[i + 1].x - 95} y2={NODE_Y}
              stroke={C.border} strokeWidth={10} strokeDasharray="22 16" strokeDashoffset={-frame * 3}
              opacity={fade(frame, 20 + i * 20)} />
          ))}
        </svg>
        {/* moving coins */}
        {coins.map((c) => {
          const t = ((frame - 40 - c * 18) / 70) % 1;
          if (frame < 40 + c * 18) return null;
          const x = interpolate(t, [0, 1], [NODES[0].x, NODES[2].x]);
          const slow = Math.abs(x - NODES[1].x) < 60 ? 0.9 : 1;
          return (
            <div key={c} style={{ position: "absolute", left: x - 34, top: NODE_Y - 34 - 6, width: 68, height: 68, borderRadius: 999,
              background: C.yellow, color: C.bg, fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${slow})`, boxShadow: "0 4px 14px rgba(0,0,0,0.5)" }}>
              ₹
            </div>
          );
        })}
        {NODES.map((n, i) => {
          const p = usePopSafe(frame, i * 12);
          const hl = i === 1;
          return (
            <div key={n.label} style={{ position: "absolute", left: n.x - 140, top: NODE_Y - 95, width: 280, display: "flex", flexDirection: "column", alignItems: "center", opacity: p, transform: `scale(${p})` }}>
              <div style={{ width: 190, height: 190, borderRadius: 999, background: C.panel, display: "flex", alignItems: "center", justifyContent: "center",
                border: `6px solid ${n.color}`,
                boxShadow: hl ? `0 0 ${50 * pulse(frame, 0.2, 0.4)}px ${C.yellow}` : "none",
                transform: hl ? `scale(${pulse(frame, 0.2, 0.05)})` : undefined }}>
                {i === 0 ? <PersonIcon size={130} color={C.red} /> : <BankIcon size={110} color={n.color} />}
              </div>
              <Label size={hl ? 50 : 42} color={n.color} style={{ marginTop: 18, fontWeight: 800 }}>{n.label}</Label>
            </div>
          );
        })}
        <div style={{ position: "absolute", top: 120, left: 0, right: 0, opacity: fade(frame, 60) }}>
          <Label size={48} color={C.red}>ठगी का पैसा →</Label>
        </div>
      </div>
    </Stage>
  );
};

const usePopSafe = (frame: number, delay: number) =>
  interpolate(frame, [delay, delay + 12], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });

/* 15-22 s: police investigation card, account turns into a frozen ice block */
export const FrozenScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = usePop(0);
  const ice = interpolate(frame, [70, 100], [0, 1], clamp);
  const stamp = usePop(110, 10);
  return (
    <Stage style={{ justifyContent: "flex-start", paddingTop: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 26, background: C.panel, border: `4px solid ${C.blue}`, borderRadius: 30,
        padding: "22px 40px", transform: `translateY(${interpolate(card, [0, 1], [-200, 0])}px)`, opacity: card }}>
        <ShieldIcon size={110} />
        <div>
          <div style={{ fontSize: 54, fontWeight: 800 }}>पुलिस जाँच शुरू</div>
          <div style={{ fontSize: 34, color: C.muted }}>खाता: आपका · पूछताछ: आपसे</div>
        </div>
        <Magnifier size={100} style={{ transform: `rotate(${Math.sin(frame * 0.15) * 10}deg)` }} />
      </div>
      <div style={{ position: "relative", marginTop: 70, width: 420, height: 420, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 340, height: 340, borderRadius: 50, background: C.panel, border: `6px solid ${C.yellow}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <BankIcon size={170} color={C.yellow} />
          <Label size={42} style={{ marginTop: 10 }}>आपका खाता</Label>
        </div>
        {/* ice block */}
        <div style={{ position: "absolute", inset: 0, borderRadius: 60, opacity: ice, transform: `scale(${interpolate(ice, [0, 1], [0.6, 1])})`,
          background: "linear-gradient(135deg, rgba(186,230,253,0.75), rgba(56,189,248,0.45))", border: "6px solid #E0F2FE",
          boxShadow: "0 0 60px rgba(125,211,252,0.6)" }}>
          <div style={{ position: "absolute", left: 40, top: 30, width: 26, height: 160, background: "rgba(255,255,255,0.7)", borderRadius: 20, transform: "rotate(25deg)" }} />
          <div style={{ position: "absolute", left: 90, top: 40, width: 12, height: 90, background: "rgba(255,255,255,0.6)", borderRadius: 20, transform: "rotate(25deg)" }} />
        </div>
        <div style={{ position: "absolute", bottom: -10, right: -60, transform: `rotate(-12deg) scale(${stamp})`, border: `8px solid ${C.red}`, color: C.red,
          fontSize: 76, fontWeight: 800, padding: "0 30px", borderRadius: 16, background: "rgba(10,14,26,0.85)" }}>
          फ्रीज़
        </div>
      </div>
    </Stage>
  );
};

/* 22-29 s: scale of justice, "मुझे नहीं पता था" bubble fades away */
export const JusticeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const tilt = interpolate(frame, [0, 40, 70], [0, -8, 10], clamp) + Math.sin(frame * 0.08) * 1.5;
  const bubbleIn = usePop(10);
  const bubbleOut = interpolate(frame, [80, 130], [1, 0], clamp);
  const stamp = usePop(135, 10);
  return (
    <Stage style={{ justifyContent: "flex-start" }}>
      <div style={{ position: "relative", width: 1000, height: 760 }}>
        <svg width={560} height={560} viewBox="0 0 200 200" style={{ position: "absolute", left: 220, top: 170 }}>
          <rect x="94" y="40" width="12" height="130" fill={C.yellow} />
          <rect x="60" y="170" width="80" height="14" rx="4" fill={C.yellow} />
          <circle cx="100" cy="38" r="10" fill={C.yellow} />
          <g transform={`rotate(${tilt} 100 46)`}>
            <rect x="20" y="42" width="160" height="8" rx="4" fill={C.yellow} />
            <g transform={`rotate(${-tilt} 28 46)`}>
              <line x1="28" y1="46" x2="12" y2="100" stroke={C.yellow} strokeWidth="2" />
              <line x1="28" y1="46" x2="44" y2="100" stroke={C.yellow} strokeWidth="2" />
              <path d="M6 100 H50 A22 12 0 0 1 6 100 Z" fill={C.yellow} />
            </g>
            <g transform={`rotate(${-tilt} 172 46)`}>
              <line x1="172" y1="46" x2="156" y2="100" stroke={C.yellow} strokeWidth="2" />
              <line x1="172" y1="46" x2="188" y2="100" stroke={C.yellow} strokeWidth="2" />
              <path d="M150 100 H194 A22 12 0 0 1 150 100 Z" fill={C.yellow} />
            </g>
          </g>
        </svg>
        <div style={{ position: "absolute", left: 20, top: 20, opacity: bubbleIn * bubbleOut,
          transform: `translateY(${(1 - bubbleOut) * -80}px) scale(${bubbleIn})`, filter: `blur(${(1 - bubbleOut) * 8}px)` }}>
          <div style={{ background: "#fff", color: C.bg, fontSize: 54, fontWeight: 800, padding: "22px 40px", borderRadius: 40, borderBottomLeftRadius: 6 }}>
            "मुझे नहीं पता था"
          </div>
        </div>
        <div style={{ position: "absolute", right: 30, top: 40, transform: `rotate(10deg) scale(${stamp})`, border: `8px solid ${C.red}`, color: C.red,
          fontSize: 64, fontWeight: 800, padding: "0 28px", borderRadius: 16, background: "rgba(10,14,26,0.85)" }}>
          बचाव नहीं
        </div>
      </div>
    </Stage>
  );
};

/* 29-36 s: red crosses over account number, debit card, OTP and PIN */
const Tile: React.FC<{ title: string; delay: number; children: React.ReactNode }> = ({ title, delay, children }) => {
  const frame = useCurrentFrame();
  const p = usePop(delay);
  const x = interpolate(frame, [delay + 22, delay + 34], [0, 1], clamp);
  return (
    <div style={{ position: "relative", width: 430, height: 320, background: C.panel, border: `4px solid ${C.border}`, borderRadius: 32,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: p, transform: `scale(${p})` }}>
      {children}
      <Label size={46} style={{ marginTop: 34 }}>{title}</Label>
      <div style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CrossMark size={170} progress={x} style={{ opacity: 0.92 }} />
      </div>
    </div>
  );
};

export const NeverShareScene: React.FC = () => (
  <Stage>
    <div style={{ display: "grid", gridTemplateColumns: "430px 430px", gap: 36 }}>
      <Tile title="खाता नंबर" delay={4}>
        <div style={{ fontSize: 56, fontWeight: 800, letterSpacing: 4, color: C.muted }}>XXXX 4821</div>
      </Tile>
      <Tile title="डेबिट कार्ड" delay={20}>
        <div style={{ width: 230, height: 140, borderRadius: 18, background: "linear-gradient(135deg,#6366F1,#0EA5E9)", position: "relative" }}>
          <div style={{ position: "absolute", left: 22, top: 34, width: 46, height: 34, borderRadius: 6, background: C.yellow }} />
          <div style={{ position: "absolute", left: 22, bottom: 20, width: 150, height: 12, borderRadius: 6, background: "rgba(255,255,255,0.7)" }} />
        </div>
      </Tile>
      <Tile title="OTP" delay={36}>
        <div style={{ display: "flex", gap: 12 }}>
          {[4, 7, 1, 9, 2, 6].map((d, i) => (
            <div key={i} style={{ width: 52, height: 72, borderRadius: 10, background: "#243049", fontSize: 46, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{d}</div>
          ))}
        </div>
      </Tile>
      <Tile title="PIN" delay={52}>
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: 18, color: C.muted }}>••••</div>
      </Tile>
    </div>
  </Stage>
);
