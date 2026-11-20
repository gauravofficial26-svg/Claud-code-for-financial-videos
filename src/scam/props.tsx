// Generic props for Episodes 2-5 (no real logos or brands)
import { interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

export const Fingerprint: React.FC<{ size?: number; color?: string; glow?: boolean; style?: React.CSSProperties }> = ({ size = 300, color = C.red, glow, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={{ filter: glow ? `drop-shadow(0 0 18px ${color})` : undefined, ...style }}>
    <g fill="none" stroke={color} strokeWidth="4" strokeLinecap="round">
      {[44, 37, 30, 23, 16, 9].map((r, i) => (
        <path key={r} d={`M${50 - r} ${62 + i * 2} C${50 - r} ${62 - r * 1.25} ${50 + r} ${62 - r * 1.25} ${50 + r} ${62 + i * 2} ${i % 2 ? `L${50 + r} ${80 + i * 3}` : ""}`} />
      ))}
      <path d="M50 58 L50 96" />
      <path d="M38 70 C38 88 44 100 52 110" />
      <path d="M62 66 C64 86 60 100 54 112" />
    </g>
  </svg>
);

export const IdCard: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 420, style }) => (
  <div style={{ width, height: width * 0.62, background: "linear-gradient(135deg,#FFF7ED,#FED7AA)", borderRadius: 22, padding: 22, position: "relative", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", color: "#1F2937", ...style }}>
    <div style={{ fontSize: width * 0.085, fontWeight: 800 }}>आधार कार्ड</div>
    <div style={{ position: "absolute", left: 22, top: width * 0.17, width: width * 0.24, height: width * 0.3, borderRadius: 10, background: "#CBD5E1" }} />
    {[0, 1, 2].map((i) => <div key={i} style={{ position: "absolute", left: width * 0.33, top: width * (0.2 + i * 0.07), width: width * (0.5 - i * 0.1), height: width * 0.03, borderRadius: 6, background: "#9CA3AF" }} />)}
    <div style={{ position: "absolute", left: 22, bottom: 18, fontSize: width * 0.075, fontWeight: 800, letterSpacing: 3 }}>XXXX XXXX 4821</div>
  </div>
);

/** Property registry paper with a thumb impression that appears at `stampAt` */
export const DocPaper: React.FC<{ width?: number; stampAt?: number; title?: string; style?: React.CSSProperties }> = ({ width = 420, stampAt = 0, title = "रजिस्ट्री", style }) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [stampAt, stampAt + 6], [0, 1], clamp);
  return (
    <div style={{ width, height: width * 1.25, background: "#FEF9C3", borderRadius: 10, padding: 26, position: "relative", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", color: "#3F3F46", ...style }}>
      <div style={{ fontSize: width * 0.09, fontWeight: 800, textAlign: "center" }}>{title}</div>
      {Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ height: width * 0.025, width: `${90 - (i % 3) * 15}%`, background: "#A8A29E", borderRadius: 4, margin: `${width * 0.04}px 0` }} />)}
      <div style={{ position: "absolute", right: 30, bottom: 26, opacity: s, transform: `scale(${1.6 - s * 0.6})` }}>
        <Fingerprint size={width * 0.22} color="#7C3AED" />
      </div>
    </div>
  );
};

/** Small biometric scanner (micro-ATM style) */
export const Scanner: React.FC<{ width?: number; screen?: React.ReactNode; glow?: string; style?: React.CSSProperties }> = ({ width = 460, screen, glow = "#22D3EE", style }) => (
  <div style={{ width, height: width * 0.9, background: "linear-gradient(#374151,#1F2937)", borderRadius: 40, position: "relative", boxShadow: "0 20px 50px rgba(0,0,0,0.6)", ...style }}>
    <div style={{ position: "absolute", left: "10%", right: "10%", top: "8%", height: "34%", background: "#0B1220", borderRadius: 18, border: "4px solid #4B5563",
      display: "flex", alignItems: "center", justifyContent: "center", fontSize: width * 0.075, fontWeight: 800, color: C.text, textAlign: "center", padding: 10 }}>
      {screen}
    </div>
    <div style={{ position: "absolute", left: "28%", right: "28%", top: "52%", height: "36%", background: "#111827", borderRadius: 20, border: `5px solid ${glow}`, boxShadow: `0 0 30px ${glow}` }} />
  </div>
);

export const Toggle: React.FC<{ on: number; width?: number; label?: string }> = ({ on, width = 200, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
    {label && <div style={{ fontSize: 44, fontWeight: 800 }}>{label}</div>}
    <div style={{ width, height: width * 0.55, borderRadius: 999, background: on > 0.5 ? C.green : "#475569", position: "relative", transition: "none" }}>
      <div style={{ position: "absolute", top: width * 0.05, left: width * 0.05 + on * width * 0.45, width: width * 0.45, height: width * 0.45, borderRadius: 999, background: "#fff", boxShadow: "0 4px 10px rgba(0,0,0,0.4)" }} />
    </div>
  </div>
);

export const Padlock: React.FC<{ open: number; size?: number; color?: string }> = ({ open, size = 200, color = C.yellow }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120">
    <path d={`M28 56 V36 a22 22 0 0 1 44 0 V${56 - open * 22}`} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" transform={`translate(0 ${-open * 10})`} />
    <rect x="14" y="54" width="72" height="58" rx="12" fill={color} />
    <circle cx="50" cy="80" r="8" fill={C.bg} />
    <rect x="46" y="82" width="8" height="16" rx="3" fill={C.bg} />
  </svg>
);

export const Clock: React.FC<{ size?: number; label?: string }> = ({ size = 220, label }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill="#F8FAFC" stroke={C.red} strokeWidth="8" />
        <line x1="50" y1="50" x2="50" y2="20" stroke={C.bg} strokeWidth="5" strokeLinecap="round" transform={`rotate(${frame * 6} 50 50)`} />
        <line x1="50" y1="50" x2="68" y2="50" stroke={C.bg} strokeWidth="6" strokeLinecap="round" />
        <circle cx="50" cy="50" r="5" fill={C.red} />
      </svg>
      {label && <div style={{ fontSize: 44, fontWeight: 800, color: C.red, marginTop: 6 }}>{label}</div>}
    </div>
  );
};

/** Phone call UI (inside PhoneCloseup) */
export const CallScreen: React.FC<{ name: string; sub?: string; ringing?: boolean; second?: { name: string; locked?: boolean } | null; mergeGlow?: boolean; pressed?: boolean }> = ({ name, sub, ringing, second, mergeGlow, pressed }) => {
  const frame = useCurrentFrame();
  const ring = ringing ? 1 + Math.sin(frame * 0.6) * 0.08 : 1;
  const btn = (label: string, active = false) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <div style={{ width: 120, height: 120, borderRadius: 99, background: active ? C.red : "#334155", boxShadow: active ? `0 0 ${30 + Math.sin(frame * 0.4) * 20}px ${C.red}` : undefined,
        transform: active && pressed ? "scale(0.88)" : undefined, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30, fontWeight: 800 }}>{label === "मर्ज" ? "⇆" : label === "म्यूट" ? "🎤" : "＋"}</div>
      <div style={{ fontSize: 30, fontWeight: 700, color: active ? C.red : C.muted }}>{label}</div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#1E293B,#0F172A)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 110 }}>
      {second && (
        <div style={{ position: "absolute", top: 70, left: 30, right: 30, background: "#334155", borderRadius: 24, padding: "14px 24px", display: "flex", justifyContent: "space-between", fontSize: 32, fontWeight: 700 }}>
          <span>{second.locked ? "🔒 " : ""}{second.name}</span><span style={{ color: C.green }}>होल्ड पर</span>
        </div>
      )}
      <div style={{ marginTop: second ? 90 : 40, width: 200, height: 200, borderRadius: 99, background: "#64748B", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 110, fontWeight: 800, color: "#0F172A", transform: `scale(${ring})` }}>?</div>
      <div style={{ fontSize: 56, fontWeight: 800, marginTop: 26 }}>{name}</div>
      <div style={{ fontSize: 34, color: C.muted }}>{sub ?? (ringing ? "कॉल आ रही है..." : `00:${String(10 + Math.floor(frame / 30)).padStart(2, "0")}`)}</div>
      <div style={{ display: "flex", gap: 46, marginTop: 70 }}>
        {btn("म्यूट")}
        {btn("मर्ज", mergeGlow)}
        {btn("जोड़ें")}
      </div>
      <div style={{ marginTop: 60, width: 130, height: 130, borderRadius: 99, background: C.red, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 60 }}>✆</div>
    </div>
  );
};

/** Group chat header with growing member count */
export const GroupHeader: React.FC<{ name: string; members: number }> = ({ name, members }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "80px 30px 24px", background: "#18233A" }}>
    <div style={{ width: 84, height: 84, borderRadius: 99, background: "#16A34A", fontSize: 40, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>₹</div>
    <div>
      <div style={{ fontSize: 42, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 30, color: C.muted }}>{members.toLocaleString("en-IN")} सदस्य</div>
    </div>
  </div>
);

/** Fake "profit screenshot" bubble */
export const ProfitShot: React.FC<{ pct: string }> = ({ pct }) => (
  <div style={{ margin: "0 30px 18px", alignSelf: "flex-start", background: "#24324F", borderRadius: 26, padding: 16, width: 380 }}>
    <div style={{ background: "#0B1220", borderRadius: 16, height: 150, position: "relative", overflow: "hidden" }}>
      <svg width="348" height="150"><polyline points="0,130 60,110 110,118 170,80 230,70 290,30 348,12" fill="none" stroke={C.green} strokeWidth="6" /></svg>
      <div style={{ position: "absolute", right: 14, top: 10, fontSize: 40, fontWeight: 800, color: C.green }}>{pct}</div>
    </div>
  </div>
);

/** Trading app screen (inside PhoneCloseup) */
export const TradingApp: React.FC<{ balance: number; progress: number; withdraw?: "idle" | "pressed" | "blocked" }> = ({ balance, progress, withdraw = "idle" }) => {
  const pts = [130, 118, 124, 100, 92, 70, 76, 50, 40, 22, 14];
  const n = Math.max(2, Math.round(progress * pts.length));
  return (
    <div style={{ position: "absolute", inset: 0, background: "#0B1220", padding: "100px 34px 0" }}>
      <div style={{ fontSize: 34, color: C.muted, fontWeight: 700 }}>मेरा पोर्टफोलियो</div>
      <div style={{ fontSize: 96, fontWeight: 800, color: C.green }}>₹{Math.round(balance).toLocaleString("en-IN")}</div>
      <div style={{ fontSize: 40, fontWeight: 800, color: C.green }}>▲ मुनाफ़ा</div>
      <svg width="568" height="300" style={{ marginTop: 30 }}>
        <polyline points={pts.slice(0, n).map((y, i) => `${i * 56},${y * 2}`).join(" ")} fill="none" stroke={C.green} strokeWidth="8" strokeLinejoin="round" />
      </svg>
      <div style={{ marginTop: 50, borderRadius: 28, padding: "26px 0", textAlign: "center", fontSize: 50, fontWeight: 800,
        background: withdraw === "blocked" ? "#475569" : C.blue, color: withdraw === "blocked" ? "#94A3B8" : "#fff", transform: withdraw === "pressed" ? "scale(0.94)" : undefined }}>
        पैसे निकालें
      </div>
    </div>
  );
};

/** Insurance policy paper */
export const PolicyDoc: React.FC<{ width?: number; style?: React.CSSProperties }> = ({ width = 460, style }) => (
  <div style={{ width, height: width * 1.2, background: "#F1F5F9", borderRadius: 12, padding: 30, color: "#1E293B", boxShadow: "0 16px 40px rgba(0,0,0,0.5)", ...style }}>
    <div style={{ fontSize: width * 0.09, fontWeight: 800 }}>बीमा पॉलिसी</div>
    <div style={{ fontSize: width * 0.05, color: "#64748B", fontWeight: 700 }}>पॉलिसी नं. XXXX-2011</div>
    {Array.from({ length: 7 }).map((_, i) => <div key={i} style={{ height: width * 0.025, width: `${92 - (i % 3) * 18}%`, background: "#CBD5E1", borderRadius: 4, margin: `${width * 0.045}px 0` }} />)}
  </div>
);

/** Browser card showing an official site URL */
export const BrowserCard: React.FC<{ url: string; title: string; ok?: boolean; width?: number }> = ({ url, title, ok = true, width = 900 }) => (
  <div style={{ width, background: "#F8FAFC", borderRadius: 30, overflow: "hidden", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", color: "#0F172A" }}>
    <div style={{ background: "#E2E8F0", padding: "18px 26px", display: "flex", alignItems: "center", gap: 16 }}>
      {["#EF4444", "#F59E0B", "#22C55E"].map((c) => <div key={c} style={{ width: 22, height: 22, borderRadius: 99, background: c }} />)}
      <div style={{ flex: 1, background: "#fff", borderRadius: 999, padding: "8px 24px", fontSize: 38, fontWeight: 700 }}>🔒 {url}</div>
    </div>
    <div style={{ padding: "34px 36px", display: "flex", alignItems: "center", gap: 26 }}>
      <div style={{ width: 90, height: 90, borderRadius: 99, background: ok ? C.green : C.red, color: "#fff", fontSize: 60, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{ok ? "✓" : "✗"}</div>
      <div style={{ fontSize: 50, fontWeight: 800, lineHeight: 1.2 }}>{title}</div>
    </div>
  </div>
);

/** Big red pressure card */
export const PressureCard: React.FC<{ text: string; at: number; rotate?: number }> = ({ text, at: a, rotate = 0 }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [a, a + 6], [0, 1], { ...clamp, easing: (t) => t * t });
  if (frame < a) return null;
  return (
    <div style={{ background: C.red, color: "#fff", fontSize: 70, fontWeight: 800, padding: "22px 40px", borderRadius: 24, margin: "16px 0", textAlign: "center",
      transform: `rotate(${rotate}deg) scale(${interpolate(p, [0, 1], [2, 1])})`, opacity: p, boxShadow: "0 16px 40px rgba(0,0,0,0.5)" }}>
      {text}
    </div>
  );
};

/** Piggy bank */
export const Piggy: React.FC<{ size?: number }> = ({ size = 420 }) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 200 160">
    <ellipse cx="100" cy="88" rx="78" ry="58" fill="#F9A8D4" />
    <circle cx="160" cy="70" r="26" fill="#F9A8D4" />
    <ellipse cx="178" cy="76" rx="12" ry="10" fill="#F472B6" />
    <circle cx="156" cy="60" r="5" fill="#1F2937" />
    <polygon points="140,40 150,18 160,44" fill="#F472B6" />
    {[52, 84, 118, 146].map((x) => <rect key={x} x={x - 9} y="130" width="18" height="24" rx="6" fill="#F472B6" />)}
    <rect x="80" y="34" width="40" height="8" rx="4" fill="#9D174D" />
  </svg>
);
