export const theme = {
  bg: "#0B0F17",
  panel: "#141B27",
  border: "#232D3F",
  text: "#F2F5FA",
  muted: "#8A96AB",
  up: "#22C55E",
  down: "#EF4444",
  accent: "#FACC15",
  font: "Inter, 'Helvetica Neue', Arial, sans-serif",
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;

// Scene lengths in frames
export const SCENES = {
  hook: 3 * FPS,
  chart: 7 * FPS,
  stats: 6 * FPS,
  takeaways: 6 * FPS,
  cta: 3 * FPS,
};

export const TOTAL_FRAMES = Object.values(SCENES).reduce((a, b) => a + b, 0);
