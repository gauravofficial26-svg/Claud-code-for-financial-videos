// Backgrounds / props for story scenes (1080x1920 frame)
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { C } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Slow camera push-in for a living feel */
export const Cam: React.FC<{ children: React.ReactNode; from?: number; to?: number; dur?: number; origin?: string }> = ({
  children, from = 1, to = 1.06, dur = 240, origin = "50% 40%",
}) => {
  const frame = useCurrentFrame();
  const s = interpolate(frame, [0, dur], [from, to], clamp);
  return <AbsoluteFill style={{ transform: `scale(${s})`, transformOrigin: origin }}>{children}</AbsoluteFill>;
};

export const Floor: React.FC<{ y?: number; color?: string }> = ({ y = 1240, color = "#141A2C" }) => (
  <div style={{ position: "absolute", left: 0, right: 0, top: y, bottom: 0, background: `linear-gradient(${color}, #0A0E1A)` }} />
);

/** Rahul's room at night */
export const Room: React.FC<{ door?: number; dim?: boolean; children?: React.ReactNode }> = ({ door, dim, children }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#22304F" }}>
      {/* wallpaper stripes */}
      <svg width={1080} height={1240} style={{ position: "absolute" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={i * 96} y={0} width={48} height={1240} fill="#26365A" />
        ))}
      </svg>
      {/* window */}
      <div style={{ position: "absolute", left: 70, top: 300, width: 330, height: 400, background: "linear-gradient(#0B1535,#1E3A8A)", border: "16px solid #8B6B4A", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ position: "absolute", right: 50, top: 50, width: 80, height: 80, borderRadius: 999, background: "#FDE68A", boxShadow: "0 0 50px #FDE68A" }} />
        {[[40, 60], [120, 140], [70, 250], [220, 200], [160, 40], [250, 300]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: 6, height: 6, borderRadius: 9, background: "#fff", opacity: 0.4 + 0.6 * Math.abs(Math.sin(frame * 0.05 + i)) }} />
        ))}
        <div style={{ position: "absolute", left: 149, top: 0, width: 10, height: "100%", background: "#8B6B4A" }} />
        <div style={{ position: "absolute", top: 184, left: 0, height: 10, width: "100%", background: "#8B6B4A" }} />
      </div>
      {/* poster */}
      <div style={{ position: "absolute", right: 120, top: 330, width: 210, height: 280, background: "#F59E0B", borderRadius: 6, transform: "rotate(3deg)", boxShadow: "0 10px 30px rgba(0,0,0,0.4)" }}>
        <div style={{ margin: 30, height: 120, borderRadius: 999, background: "#FDE68A" }} />
        <div style={{ margin: "0 30px", height: 14, background: "#B45309", borderRadius: 6 }} />
        <div style={{ margin: "14px 30px", height: 14, width: 100, background: "#B45309", borderRadius: 6 }} />
      </div>
      {door !== undefined && <Door open={door} />}
      <Floor />
      {children}
      {/* lamp glow */}
      <div style={{ position: "absolute", inset: 0, background: dim ? "rgba(5,8,20,0.45)" : "radial-gradient(circle at 80% 62%, rgba(253,230,138,0.18), transparent 45%)" }} />
    </AbsoluteFill>
  );
};

const Door: React.FC<{ open: number }> = ({ open }) => (
  <div style={{ position: "absolute", right: 60, top: 520, width: 300, height: 720, background: "#0B0F1A" }}>
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(#FDE68A55,#FDE68A11)" }} />
    <div style={{ position: "absolute", left: 0, top: 0, width: 300, height: 720, background: "#7C5A3A", border: "10px solid #5C4026",
      transformOrigin: "left center", transform: `perspective(1200px) rotateY(${-open * 75}deg)` }}>
      <div style={{ position: "absolute", left: 30, top: 40, right: 30, height: 260, border: "8px solid #5C4026" }} />
      <div style={{ position: "absolute", left: 30, top: 340, right: 30, height: 300, border: "8px solid #5C4026" }} />
      <div style={{ position: "absolute", right: 26, top: 360, width: 26, height: 26, borderRadius: 99, background: "#E5C068" }} />
    </div>
  </div>
);

/** Desk drawn in front of a sitting character */
export const Desk: React.FC<{ laptop?: boolean; lamp?: boolean; phoneOnDesk?: boolean; buzz?: boolean }> = ({ laptop = true, lamp = true, phoneOnDesk, buzz }) => {
  const frame = useCurrentFrame();
  const jitter = buzz ? Math.sin(frame * 2.5) * 6 : 0;
  return (
    <>
      {laptop && (
        <div style={{ position: "absolute", left: 60, top: 900, width: 300, height: 220 }}>
          <div style={{ position: "absolute", inset: 0, background: "#9CA3AF", borderRadius: "16px 16px 0 0", transform: "perspective(600px) rotateY(20deg)", boxShadow: "0 0 60px rgba(147,197,253,0.45)" }}>
            <div style={{ position: "absolute", left: "42%", top: "40%", width: 40, height: 40, borderRadius: 99, background: "#D1D5DB" }} />
          </div>
        </div>
      )}
      {lamp && (
        <div style={{ position: "absolute", right: 90, top: 830, width: 160, height: 300 }}>
          <div style={{ position: "absolute", left: 30, top: 0, width: 110, height: 90, background: "#F59E0B", clipPath: "polygon(20% 0, 80% 0, 100% 100%, 0 100%)" }} />
          <div style={{ position: "absolute", left: 78, top: 90, width: 12, height: 190, background: "#4B5563" }} />
          <div style={{ position: "absolute", left: 40, top: 270, width: 90, height: 20, borderRadius: 8, background: "#4B5563" }} />
        </div>
      )}
      {/* desk */}
      <div style={{ position: "absolute", left: -20, right: -20, top: 1110, height: 60, background: "#8B5E3C", borderRadius: 10, boxShadow: "0 12px 0 #6B4528" }} />
      <div style={{ position: "absolute", left: 40, top: 1170, width: 50, height: 300, background: "#6B4528" }} />
      <div style={{ position: "absolute", right: 40, top: 1170, width: 50, height: 300, background: "#6B4528" }} />
      {phoneOnDesk && (
        <div style={{ position: "absolute", left: 600 + jitter, top: 1078, width: 150, height: 40, background: "#111827", borderRadius: 10, border: "4px solid #374151" }}>
          {buzz && <div style={{ position: "absolute", inset: 4, background: "#60A5FA", borderRadius: 6, opacity: 0.8 }} />}
        </div>
      )}
      {buzz && (
        <svg width={300} height={120} style={{ position: "absolute", left: 525, top: 1010 }}>
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${40 - i * 18} ${70 - i * 10} q-14 20 0 40`} transform={`translate(${-(frame % 10)} 0)`} stroke="#93C5FD" strokeWidth="6" fill="none" strokeLinecap="round" opacity={0.8 - i * 0.2} />
          ))}
          {[0, 1, 2].map((i) => (
            <path key={`r${i}`} d={`M${260 + i * 18} ${70 - i * 10} q14 20 0 40`} stroke="#93C5FD" strokeWidth="6" fill="none" strokeLinecap="round" opacity={0.8 - i * 0.2} />
          ))}
        </svg>
      )}
    </>
  );
};

/** Big phone held in a hand (close-up). Children render on the screen. */
export const PhoneCloseup: React.FC<{ children: React.ReactNode; skin?: string; tilt?: number; bg?: string }> = ({ children, skin = "#C98B5E", tilt = -4, bg = "#0F1626" }) => {
  const frame = useCurrentFrame();
  const float = Math.sin(frame * 0.06) * 8;
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #2A3B63, #0A0E1A 75%)" }}>
      <div style={{ position: "absolute", left: 200, top: 190 + float, width: 680, height: 1180, transform: `rotate(${tilt}deg)` }}>
        {/* palm behind */}
        <div style={{ position: "absolute", left: 60, top: 760, width: 620, height: 560, borderRadius: "220px 220px 100px 100px", background: skin }} />
        {/* phone */}
        <div style={{ position: "absolute", inset: 0, background: "#0B0B10", borderRadius: 80, padding: 22, boxShadow: "0 40px 80px rgba(0,0,0,0.6)" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", background: bg, borderRadius: 60, overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 20, left: "50%", marginLeft: -60, width: 120, height: 34, borderRadius: 99, background: "#000", zIndex: 5 }} />
            {children}
          </div>
        </div>
        {/* thumb + fingers */}
        <div style={{ position: "absolute", left: -50, top: 700, width: 150, height: 300, borderRadius: 90, background: skin, transform: "rotate(28deg)" }} />
        {[640, 760, 880].map((y) => (
          <div key={y} style={{ position: "absolute", right: -46, top: y, width: 110, height: 90, borderRadius: 50, background: skin }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const ChatHeader: React.FC<{ name: string; sub?: string }> = ({ name, sub = "online" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 22, padding: "80px 34px 26px", background: "#18233A" }}>
    <div style={{ width: 84, height: 84, borderRadius: 99, background: "#64748B", fontSize: 50, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", color: "#0F172A" }}>?</div>
    <div>
      <div style={{ fontSize: 44, fontWeight: 800 }}>{name}</div>
      <div style={{ fontSize: 30, color: C.green }}>{sub}</div>
    </div>
  </div>
);

export const ChatBubble: React.FC<{ text: string; at: number; mine?: boolean; typing?: boolean }> = ({ text, at, mine }) => {
  const frame = useCurrentFrame();
  if (frame < at - 16) return null;
  const isTyping = frame < at;
  const p = interpolate(frame, [at, at + 8], [0.6, 1], clamp);
  return (
    <div style={{ alignSelf: mine ? "flex-end" : "flex-start", margin: "0 30px 22px" }}>
      <div style={{ background: mine ? "#166534" : "#24324F", borderRadius: 30, borderTopLeftRadius: mine ? 30 : 6, borderTopRightRadius: mine ? 6 : 30,
        padding: "18px 30px", fontSize: 46, fontWeight: 700, lineHeight: 1.3, maxWidth: 500, transform: `scale(${isTyping ? 1 : p})`,
        transformOrigin: mine ? "right center" : "left center", color: isTyping ? C.muted : C.text, letterSpacing: isTyping ? 6 : 0 }}>
        {isTyping ? ".".repeat(1 + (Math.floor(frame / 5) % 3)) : text}
      </div>
    </div>
  );
};

export const Notification: React.FC<{ title: string; body: string; at: number; color?: string; icon?: string }> = ({ title, body, at, color = C.blue, icon = "₹" }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [at, at + 10], [0, 1], { ...clamp, easing: (t) => 1 - Math.pow(1 - t, 3) });
  if (frame < at) return null;
  return (
    <div style={{ display: "flex", gap: 20, alignItems: "center", background: "rgba(30,41,59,0.96)", borderRadius: 34, padding: "22px 26px", margin: "0 22px 16px",
      transform: `translateY(${(1 - p) * -80}px)`, opacity: p, boxShadow: "0 10px 30px rgba(0,0,0,0.5)" }}>
      <div style={{ flex: "0 0 auto", width: 76, height: 76, borderRadius: 20, background: color, fontSize: 44, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{icon}</div>
      <div>
        <div style={{ fontSize: 32, color: C.muted, fontWeight: 700 }}>{title}</div>
        <div style={{ fontSize: 42, fontWeight: 800, lineHeight: 1.2 }}>{body}</div>
      </div>
    </div>
  );
};

/** Jail bars that slam down over everything */
export const Bars: React.FC<{ at?: number }> = ({ at = 0 }) => {
  const frame = useCurrentFrame();
  const y = interpolate(frame, [at, at + 7], [-1950, 0], { ...clamp, easing: (t) => t * t });
  return (
    <AbsoluteFill style={{ transform: `translateY(${y}px)` }}>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ position: "absolute", left: 40 + i * 140, top: 0, width: 34, height: 1920, background: "linear-gradient(90deg,#4B5563,#D1D5DB 40%,#6B7280)", boxShadow: "6px 0 14px rgba(0,0,0,0.5)" }} />
      ))}
      {[380, 1180].map((t) => (
        <div key={t} style={{ position: "absolute", left: 0, right: 0, top: t, height: 40, background: "linear-gradient(#9CA3AF,#4B5563)" }} />
      ))}
    </AbsoluteFill>
  );
};

/** Lock-up cell interior */
export const Cell: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#2B3140" }}>
    <svg width={1080} height={1240} style={{ position: "absolute" }}>
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={(i % 6) * 190 + ((Math.floor(i / 6) % 2) * 95) - 40} y={Math.floor(i / 6) * 120 + 200} width={180} height={110} fill="#323949" />
      ))}
    </svg>
    <div style={{ position: "absolute", left: 420, top: 240, width: 240, height: 120, background: "#0F172A", border: "10px solid #4B5563" }}>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{ position: "absolute", left: 20 + i * 56, top: 0, width: 10, height: "100%", background: "#4B5563" }} />)}
    </div>
    <div style={{ position: "absolute", left: 470, top: 360, width: 600, height: 700, background: "radial-gradient(circle at 30% 0%, rgba(147,197,253,0.18), transparent 60%)" }} />
    <Floor color="#1C2130" />
    {children}
  </AbsoluteFill>
);

/** Plain police-station room: notice board + table, no emblems */
export const Station: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#3A4A4F" }}>
    <div style={{ position: "absolute", left: 0, right: 0, top: 760, height: 480, background: "#33424A" }} />
    <div style={{ position: "absolute", left: 360, top: 280, width: 360, height: 250, background: "#7C5A3A", border: "12px solid #5C4026" }}>
      {[[20, 20, 120, 90, "#F3F4F6"], [170, 30, 140, 70, "#FDE68A"], [40, 130, 100, 80, "#BFDBFE"], [180, 120, 120, 90, "#F3F4F6"]].map(([x, y, w, h, c], i) => (
        <div key={i} style={{ position: "absolute", left: x as number, top: y as number, width: w as number, height: h as number, background: c as string, transform: `rotate(${(i % 2 ? 1 : -1) * 3}deg)` }} />
      ))}
    </div>
    <div style={{ position: "absolute", right: 90, top: 280, width: 120, height: 120, borderRadius: 99, background: "#F3F4F6", border: "10px solid #1F2937" }}>
      <div style={{ position: "absolute", left: 50, top: 18, width: 8, height: 44, background: "#1F2937" }} />
      <div style={{ position: "absolute", left: 50, top: 50, width: 36, height: 8, background: "#1F2937" }} />
    </div>
    <Floor color="#262F36" />
    {children}
  </AbsoluteFill>
);

export const Table: React.FC = () => (
  <>
    <div style={{ position: "absolute", left: -20, right: -20, top: 1110, height: 60, background: "#5C4026", borderRadius: 8, boxShadow: "0 12px 0 #3F2C1A" }} />
    <div style={{ position: "absolute", left: 440, top: 1056, width: 200, height: 54, background: "#F3F4F6", transform: "rotate(-4deg)" }} />
  </>
);

/** Old lady's living room */
export const Home: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ background: "#5B3A4A" }}>
    <div style={{ position: "absolute", left: 120, top: 300, width: 220, height: 280, background: "#E8D5B5", border: "14px solid #8B6B4A" }}>
      <div style={{ margin: 30, height: 160, background: "#86EFAC", borderRadius: "50% 50% 10px 10px" }} />
    </div>
    <div style={{ position: "absolute", left: 0, right: 0, top: 860, height: 400, background: "#7C2D12", borderRadius: "60px 60px 0 0" }} />
    <Floor color="#2A1A22" />
    {children}
  </AbsoluteFill>
);
