// Generic, brand-free SVG icons for the Scam Alert series.
import { C } from "./theme";

type P = { size?: number; color?: string; style?: React.CSSProperties };

export const PersonIcon: React.FC<P & { cap?: boolean }> = ({ size = 160, color = C.muted, cap, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="32" r="17" fill={color} />
    <path d="M18 92 C18 66 32 56 50 56 C68 56 82 66 82 92 Z" fill={color} />
    {cap && (
      <g>
        <polygon points="50,6 82,18 50,30 18,18" fill={C.yellow} />
        <rect x="36" y="20" width="28" height="8" fill={C.yellow} />
        <line x1="80" y1="18" x2="80" y2="34" stroke={C.yellow} strokeWidth="3" />
      </g>
    )}
  </svg>
);

export const BankIcon: React.FC<P> = ({ size = 160, color = C.text, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <polygon points="50,8 92,30 8,30" fill={color} />
    {[18, 34, 50, 66, 82].map((x) => (
      <rect key={x} x={x - 4} y="36" width="8" height="38" rx="2" fill={color} />
    ))}
    <rect x="8" y="78" width="84" height="10" rx="3" fill={color} />
  </svg>
);

export const PassbookIcon: React.FC<P> = ({ size = 360, style }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 100 120" style={style}>
    <rect x="6" y="6" width="88" height="108" rx="8" fill="#1E40AF" />
    <rect x="6" y="6" width="12" height="108" rx="4" fill="#1E3A8A" />
    <g transform="translate(36 22) scale(0.42)">
      <BankIconPaths color="#DBEAFE" />
    </g>
    <rect x="28" y="72" width="54" height="5" rx="2" fill="#93C5FD" />
    <rect x="28" y="83" width="40" height="5" rx="2" fill="#93C5FD" opacity="0.7" />
    <rect x="28" y="94" width="48" height="5" rx="2" fill="#93C5FD" opacity="0.5" />
  </svg>
);

const BankIconPaths: React.FC<{ color: string }> = ({ color }) => (
  <g>
    <polygon points="50,8 92,30 8,30" fill={color} />
    {[18, 34, 50, 66, 82].map((x) => (
      <rect key={x} x={x - 4} y="36" width="8" height="38" rx="2" fill={color} />
    ))}
    <rect x="8" y="78" width="84" height="10" rx="3" fill={color} />
  </g>
);

export const PriceTag: React.FC<P & { label: string }> = ({ size = 220, label, style }) => (
  <svg width={size} height={size * 0.55} viewBox="0 0 200 110" style={style}>
    <path d="M40 8 H188 a8 8 0 0 1 8 8 V94 a8 8 0 0 1 -8 8 H40 L4 55 Z" fill={C.yellow} />
    <circle cx="34" cy="55" r="8" fill={C.bg} />
    <text x="118" y="70" textAnchor="middle" fontSize="44" fontWeight="800" fill={C.bg} fontFamily="Mukta">
      {label}
    </text>
  </svg>
);

export const Handcuffs: React.FC<P> = ({ size = 420, color = C.red, style }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 200 100" style={style}>
    <circle cx="45" cy="50" r="34" fill="none" stroke={color} strokeWidth="14" />
    <circle cx="155" cy="50" r="34" fill="none" stroke={color} strokeWidth="14" />
    <rect x="74" y="22" width="16" height="14" rx="3" fill={color} />
    <rect x="110" y="22" width="16" height="14" rx="3" fill={color} />
    {[0, 1, 2].map((i) => (
      <ellipse key={i} cx={90 + i * 10} cy="30" rx="7" ry="5" fill="none" stroke={color} strokeWidth="4" />
    ))}
  </svg>
);

export const CrossMark: React.FC<P & { progress?: number }> = ({ size = 200, color = C.red, progress = 1, style }) => {
  const len = 113;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
      <line x1="10" y1="10" x2="90" y2="90" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - Math.min(1, progress * 2))} />
      <line x1="90" y1="10" x2="10" y2="90" stroke={color} strokeWidth="14" strokeLinecap="round"
        strokeDasharray={len} strokeDashoffset={len * (1 - Math.max(0, progress * 2 - 1))} />
    </svg>
  );
};

export const TickMark: React.FC<P> = ({ size = 120, color = C.green, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="50" cy="50" r="46" fill={color} />
    <polyline points="28,52 44,68 74,36" fill="none" stroke="#fff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const ShieldIcon: React.FC<P> = ({ size = 140, color = C.blue, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M50 6 L88 20 V48 C88 72 70 88 50 96 C30 88 12 72 12 48 V20 Z" fill={color} />
    <polygon points="50,28 56,44 73,44 59,54 64,70 50,60 36,70 41,54 27,44 44,44" fill={C.yellow} />
  </svg>
);

export const Magnifier: React.FC<P> = ({ size = 140, color = C.text, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <circle cx="42" cy="42" r="28" fill="rgba(125,211,252,0.15)" stroke={color} strokeWidth="9" />
    <line x1="63" y1="63" x2="90" y2="90" stroke={color} strokeWidth="12" strokeLinecap="round" />
  </svg>
);

export const ShareArrow: React.FC<P> = ({ size = 160, color = C.text, style }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={style}>
    <path d="M58 14 L92 46 L58 78 V60 C34 60 18 68 8 88 C10 58 26 36 58 32 Z" fill={color} />
  </svg>
);

export const FollowButton: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <div
    style={{
      transform: `scale(${scale})`,
      background: C.red,
      color: "#fff",
      fontSize: 64,
      fontWeight: 800,
      padding: "18px 64px",
      borderRadius: 999,
      boxShadow: `0 0 ${40 * scale}px rgba(239,68,68,0.6)`,
      display: "flex",
      alignItems: "center",
      gap: 20,
    }}
  >
    <span style={{ fontSize: 72, lineHeight: 1 }}>+</span> फॉलो करें
  </div>
);
