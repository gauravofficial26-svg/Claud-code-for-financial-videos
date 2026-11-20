// Flat-style animated characters (generic people, no real persons or logos)
import { useCurrentFrame } from "remotion";

export type Expr = "neutral" | "happy" | "grin" | "shock" | "sad" | "worried" | "stern" | "evil";
export type Arm = "down" | "phone" | "phoneEar" | "cheek" | "wave" | "cross" | "point" | "card";
export type Look = {
  skin: string;
  hair: string;
  hairStyle: "short" | "bun" | "hood" | "police" | "long" | "bald";
  shirt: string;
  shirt2?: string;
  glasses?: boolean;
  mustache?: boolean;
  beard?: boolean;
};

export const LOOKS: Record<string, Look> = {
  rahul: { skin: "#C98B5E", hair: "#1B1B22", hairStyle: "short", shirt: "#2563EB", shirt2: "#1D4ED8" },
  granny: { skin: "#D9A47A", hair: "#D7D7DF", hairStyle: "bun", shirt: "#DB2777", shirt2: "#9D174D", glasses: true },
  scammer: { skin: "#7A5A45", hair: "#111318", hairStyle: "hood", shirt: "#1F2430", shirt2: "#151821" },
  police: { skin: "#B97B50", hair: "#1B1B22", hairStyle: "police", shirt: "#B08D57", shirt2: "#8C6E3F", mustache: true },
  friend1: { skin: "#E0A878", hair: "#3B2416", hairStyle: "long", shirt: "#16A34A", shirt2: "#15803D" },
  friend2: { skin: "#A9714A", hair: "#111", hairStyle: "short", shirt: "#F59E0B", shirt2: "#D97706" },
  dad: { skin: "#C08457", hair: "#55555F", hairStyle: "short", shirt: "#64748B", shirt2: "#475569", glasses: true, mustache: true },
  mom: { skin: "#D69A6C", hair: "#2A1A12", hairStyle: "bun", shirt: "#7C3AED", shirt2: "#5B21B6" },
};

const darken = (hex: string, amt = 0.18) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.round(v * (1 - amt)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

const ARM_PATHS: Record<Arm, { l: string; r: string; hl: [number, number]; hr: [number, number] }> = {
  down: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C308 470 312 530 308 590", hl: [92, 592], hr: [308, 592] },
  phone: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C320 470 300 520 232 508", hl: [92, 592], hr: [226, 500] },
  phoneEar: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C340 440 330 330 300 262", hl: [92, 592], hr: [298, 258] },
  cheek: { l: "M118 400 C70 380 80 320 112 284", r: "M282 400 C330 380 320 320 288 284", hl: [114, 280], hr: [286, 280] },
  wave: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C340 360 350 280 336 210", hl: [92, 592], hr: [336, 200] },
  cross: { l: "M118 400 C120 470 200 480 260 470", r: "M282 400 C280 470 200 490 140 476", hl: [262, 468], hr: [138, 476] },
  point: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C340 400 370 380 392 360", hl: [92, 592], hr: [394, 358] },
  card: { l: "M118 400 C92 470 88 530 92 590", r: "M282 400 C300 470 280 500 236 490", hl: [92, 592], hr: [232, 486] },
};

const Face: React.FC<{ look: Look; expr: Expr; talking: boolean; seed: number }> = ({ look, expr, talking, seed }) => {
  const frame = useCurrentFrame();
  const blinkCycle = (frame + seed * 37) % 96;
  const blink = blinkCycle < 4 && expr !== "shock";
  const eyeRy = blink ? 1.5 : expr === "happy" || expr === "grin" ? 9 : expr === "shock" ? 17 : 13;
  const eyeRx = expr === "shock" ? 14 : 11;
  const dark = "#1B1B22";

  // brows: [outer y, inner y] per side
  const brow = {
    neutral: [184, 184], happy: [178, 180], grin: [180, 182], shock: [168, 170], sad: [190, 178],
    worried: [188, 176], stern: [180, 194], evil: [178, 196],
  }[expr];

  const talkOpen = talking ? Math.abs(Math.sin(frame * 0.9 + seed)) * 18 + 4 : 0;
  let mouth: React.ReactNode;
  if (talking) mouth = <ellipse cx="200" cy="282" rx="20" ry={talkOpen / 2 + 3} fill="#5B1F1F" />;
  else if (expr === "happy") mouth = <path d="M168 272 Q200 306 232 272 Q200 290 168 272 Z" fill="#5B1F1F" stroke="#5B1F1F" strokeWidth="4" strokeLinejoin="round" />;
  else if (expr === "grin" || expr === "evil") mouth = <path d="M166 276 Q200 300 236 268" fill="none" stroke={expr === "evil" ? "#E5E7EB" : "#5B1F1F"} strokeWidth="7" strokeLinecap="round" />;
  else if (expr === "shock") mouth = <ellipse cx="200" cy="286" rx="16" ry="22" fill="#5B1F1F" />;
  else if (expr === "sad" || expr === "worried") mouth = <path d="M176 290 Q200 272 224 290" fill="none" stroke="#5B1F1F" strokeWidth="7" strokeLinecap="round" />;
  else if (expr === "stern") mouth = <path d="M178 284 L222 284" stroke="#5B1F1F" strokeWidth="7" strokeLinecap="round" />;
  else mouth = <path d="M180 280 Q200 290 220 280" fill="none" stroke="#5B1F1F" strokeWidth="6" strokeLinecap="round" />;

  if (look.hairStyle === "hood") {
    // shadowed face: only glowing eyes and a grin
    return (
      <g>
        <ellipse cx="166" cy="226" rx="13" ry={blink ? 2 : 7} fill="#F87171" />
        <ellipse cx="234" cy="226" rx="13" ry={blink ? 2 : 7} fill="#F87171" />
        <path d="M160 276 Q200 300 240 270" fill="none" stroke="#E5E7EB" strokeWidth="6" strokeLinecap="round" />
      </g>
    );
  }

  return (
    <g>
      {/* eyes */}
      {[165, 235].map((x) => (
        <g key={x}>
          {expr === "shock" && !blink && <ellipse cx={x} cy="226" rx="20" ry="22" fill="#fff" />}
          <ellipse cx={x} cy="226" rx={eyeRx} ry={eyeRy} fill={dark} />
          {!blink && <circle cx={x + 4} cy="221" r="3.5" fill="#fff" />}
        </g>
      ))}
      {/* tears */}
      {expr === "sad" && <path d={`M150 242 q-6 ${14 + (frame % 30) / 2} 0 ${22 + (frame % 30) / 2} q6 -6 0 -${22 + (frame % 30) / 2}`} fill="#7DD3FC" />}
      {/* brows */}
      <line x1="146" y1={brow[0]} x2="182" y2={brow[1]} stroke={look.hairStyle === "bun" && look.hair === "#D7D7DF" ? "#9CA3AF" : dark} strokeWidth="8" strokeLinecap="round" />
      <line x1="254" y1={brow[0]} x2="218" y2={brow[1]} stroke={look.hairStyle === "bun" && look.hair === "#D7D7DF" ? "#9CA3AF" : dark} strokeWidth="8" strokeLinecap="round" />
      {/* nose */}
      <path d="M200 236 Q192 258 204 260" fill="none" stroke={darken(look.skin, 0.3)} strokeWidth="5" strokeLinecap="round" />
      {look.mustache && <path d="M168 266 Q184 254 200 262 Q216 254 232 266 Q216 274 200 268 Q184 274 168 266 Z" fill={look.hair === "#55555F" ? "#4B4B55" : dark} />}
      {mouth}
      {/* cheeks */}
      {(expr === "happy" || expr === "grin") && (
        <g fill="#F87171" opacity="0.35">
          <ellipse cx="140" cy="262" rx="16" ry="9" />
          <ellipse cx="260" cy="262" rx="16" ry="9" />
        </g>
      )}
      {look.glasses && (
        <g fill="none" stroke="#2B2B33" strokeWidth="5">
          <circle cx="165" cy="226" r="26" />
          <circle cx="235" cy="226" r="26" />
          <line x1="191" y1="224" x2="209" y2="224" />
        </g>
      )}
      {expr === "shock" && (
        <g fill="#7DD3FC">
          <path d="M296 160 q-8 16 0 22 q8 -6 0 -22" />
        </g>
      )}
    </g>
  );
};

const Hair: React.FC<{ look: Look; back?: boolean }> = ({ look, back }) => {
  const h = look.hair;
  switch (look.hairStyle) {
    case "short":
      return back ? null : (
        <path d="M104 214 C96 118 160 92 206 96 C266 98 312 128 298 214 C290 170 262 150 236 148 C226 166 190 170 160 160 C130 160 112 186 104 214 Z" fill={h} />
      );
    case "long":
      return back ? (
        <path d="M96 210 C80 330 100 400 120 420 L280 420 C300 400 320 330 304 210 Z" fill={h} />
      ) : (
        <path d="M100 222 C92 120 160 92 204 94 C262 96 312 126 300 222 C286 160 240 140 200 150 C160 140 116 160 100 222 Z" fill={h} />
      );
    case "bun":
      return back ? (
        <circle cx="200" cy="110" r="44" fill={h} />
      ) : (
        <path d="M104 210 C100 128 156 104 200 104 C246 104 300 128 296 210 C284 162 250 146 200 146 C150 146 116 162 104 210 Z" fill={h} />
      );
    case "police":
      return back ? null : (
        <g>
          <path d="M106 200 C110 150 150 128 200 128 C250 128 290 150 294 200 Z" fill={h} />
          <path d="M96 168 C100 96 150 76 200 76 C250 76 300 96 304 168 Z" fill="#8C6E3F" />
          <rect x="92" y="160" width="216" height="22" rx="10" fill="#5C4524" />
          <circle cx="200" cy="124" r="16" fill="#E5C068" />
        </g>
      );
    case "hood":
      return back ? (
        <path d="M70 330 C40 160 120 70 200 70 C280 70 360 160 330 330 Z" fill={look.shirt} />
      ) : (
        <path d="M200 92 C140 92 104 140 100 210 C98 260 120 300 150 318 L120 330 C80 300 70 250 72 200 C76 120 130 74 200 74 C270 74 324 120 328 200 C330 250 320 300 280 330 L250 318 C280 300 302 260 300 210 C296 140 260 92 200 92 Z" fill={look.shirt2 ?? look.shirt} />
      );
    default:
      return null;
  }
};

export const Person: React.FC<{
  look: Look;
  expr?: Expr;
  talking?: boolean;
  arm?: Arm;
  width?: number;
  seed?: number;
  holding?: React.ReactNode;
  style?: React.CSSProperties;
  headTilt?: number;
}> = ({ look, expr = "neutral", talking = false, arm = "down", width = 400, seed = 0, style, headTilt = 0 }) => {
  const frame = useCurrentFrame();
  const breathe = Math.sin((frame + seed * 13) * 0.08) * 3;
  const a = ARM_PATHS[arm];
  const faceSkin = look.hairStyle === "hood" ? "#0B0D12" : look.skin;
  return (
    <svg width={width} height={width * 1.5} viewBox="0 0 400 600" style={{ overflow: "visible", ...style }}>
      <g transform={`translate(0 ${breathe})`}>
        <g transform={`rotate(${headTilt} 200 330)`}>
          <Hair look={look} back />
        </g>
        {/* torso */}
        <path d="M76 640 C76 440 120 372 200 372 C280 372 324 440 324 640 Z" fill={look.shirt} />
        <path d="M168 374 L200 420 L232 374 Z" fill={look.hairStyle === "hood" ? "#0B0D12" : look.skin} />
        {look.hairStyle === "police" && (
          <g>
            <rect x="196" y="420" width="8" height="220" fill={look.shirt2} />
            {[460, 520, 580].map((y) => <circle key={y} cx="200" cy={y} r="7" fill="#E5C068" />)}
            <rect x="120" y="470" width="50" height="34" rx="6" fill={look.shirt2} />
            <rect x="236" y="460" width="56" height="16" rx="4" fill="#1F2937" />
          </g>
        )}
        {look.hairStyle === "bun" && look.hair === "#D7D7DF" && (
          <path d="M120 400 C200 470 260 520 324 640 L270 640 C240 540 180 480 110 440 Z" fill={look.shirt2} />
        )}
        {/* neck + head */}
        <g transform={`rotate(${headTilt} 200 330)`}>
          <rect x="174" y="300" width="52" height="80" rx="20" fill={darken(faceSkin, 0.12)} />
          {look.hairStyle !== "hood" && (
            <>
              <ellipse cx="104" cy="234" rx="16" ry="24" fill={darken(look.skin, 0.06)} />
              <ellipse cx="296" cy="234" rx="16" ry="24" fill={darken(look.skin, 0.06)} />
            </>
          )}
          <ellipse cx="200" cy="222" rx="96" ry="110" fill={faceSkin} />
          <Hair look={look} />
          <Face look={look} expr={expr} talking={talking} seed={seed} />
        </g>
        {/* arms */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={a.l} stroke={look.shirt2 ?? darken(look.shirt)} strokeWidth="50" />
          <path d={a.r} stroke={look.shirt2 ?? darken(look.shirt)} strokeWidth="50" />
        </g>
        {arm === "phone" && <rect x="196" y="420" width="62" height="110" rx="12" fill="#111827" stroke="#374151" strokeWidth="4" transform="rotate(-8 226 475)" />}
        {arm === "phoneEar" && <rect x="292" y="200" width="44" height="88" rx="10" fill="#111827" stroke="#374151" strokeWidth="4" transform="rotate(14 314 244)" />}
        {arm === "card" && (
          <g transform="rotate(-10 232 470)">
            <rect x="196" y="430" width="120" height="76" rx="10" fill="#4F46E5" />
            <rect x="208" y="448" width="26" height="20" rx="4" fill="#FACC15" />
          </g>
        )}
        <circle cx={a.hl[0]} cy={a.hl[1]} r="26" fill={look.hairStyle === "hood" ? "#0B0D12" : look.skin} />
        <circle cx={a.hr[0]} cy={a.hr[1]} r="26" fill={look.hairStyle === "hood" ? "#0B0D12" : look.skin} />
      </g>
    </svg>
  );
};
