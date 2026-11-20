import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import type { VideoProps } from "../types";
import { SceneTitle } from "./common";

const W = 900;
const H = 760;
const PAD = 20;

export const PriceChart: React.FC<VideoProps> = ({ prices, currency, periodLabel }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [15, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.cubic),
  });

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const pts = prices.map((p, i) => [
    PAD + (i / (prices.length - 1)) * (W - PAD * 2),
    PAD + (1 - (p - min) / (max - min || 1)) * (H - PAD * 2),
  ]);
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x},${y}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;

  // Current point along the series
  const idx = progress * (prices.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, prices.length - 1);
  const t = idx - i0;
  const price = prices[i0] + (prices[i1] - prices[i0]) * t;
  const [cx, cy] = [pts[i0][0] + (pts[i1][0] - pts[i0][0]) * t, pts[i0][1] + (pts[i1][1] - pts[i0][1]) * t];

  const start = prices[0];
  const change = ((price - start) / start) * 100;
  const color = change >= 0 ? theme.up : theme.down;
  const clipX = PAD + progress * (W - PAD * 2);

  return (
    <AbsoluteFill style={{ padding: 90, paddingTop: 220 }}>
      <SceneTitle>Price action</SceneTitle>
      <div style={{ fontSize: 140, fontWeight: 900, fontVariantNumeric: "tabular-nums" }}>
        {currency}
        {price.toFixed(2)}
      </div>
      <div style={{ fontSize: 56, fontWeight: 700, color, marginTop: 10, fontVariantNumeric: "tabular-nums" }}>
        {change >= 0 ? "▲" : "▼"} {change >= 0 ? "+" : ""}
        {change.toFixed(1)}%
        <span style={{ color: theme.muted, fontWeight: 500, fontSize: 40, marginLeft: 24 }}>{periodLabel}</span>
      </div>
      <svg width={W} height={H} style={{ marginTop: 80, overflow: "visible" }}>
        <defs>
          <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
          <clipPath id="reveal">
            <rect x={0} y={-50} width={clipX} height={H + 100} />
          </clipPath>
        </defs>
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={theme.border} strokeWidth={2} />
        ))}
        <g clipPath="url(#reveal)">
          <path d={area} fill="url(#fill)" />
          <path d={line} fill="none" stroke={color} strokeWidth={8} strokeLinejoin="round" strokeLinecap="round" />
        </g>
        {progress > 0 && <circle cx={cx} cy={cy} r={16} fill={color} stroke={theme.bg} strokeWidth={6} />}
      </svg>
    </AbsoluteFill>
  );
};
