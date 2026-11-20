import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

export const usePop = (delay = 0, damping = 13) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping } });
};

export const fade = (frame: number, start: number, len = 10) =>
  interpolate(frame, [start, start + len], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

export const pulse = (frame: number, speed = 0.15, amt = 0.06) => 1 + Math.sin(frame * speed) * amt;
