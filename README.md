# Financial Videos (Shorts / Reels)

Data-driven vertical (1080×1920, 25s) finance videos built with [Remotion](https://remotion.dev).
Each video is generated from a single JSON file — swap the data, re-render, publish.

## Scenes
1. **Hook** – ticker badge + attention-grabbing question (3s)
2. **Price action** – animated price chart with live counter and % change (7s)
3. **Key numbers** – stat cards (market cap, P/E, growth…) (6s)
4. **Takeaways** – numbered bullet points (6s)
5. **Call to action** (3s)

A disclaimer stays on screen the whole time.

## Usage
```bash
npm install
npm run studio     # live preview + edit props in the browser
npm run render     # -> out/short.mp4 using data/sample.json
npm run still      # -> out/thumbnail.png
```

Make a new video:
```bash
cp data/sample.json data/tsla.json   # edit the values
npx remotion render FinancialShort out/tsla.mp4 --props=data/tsla.json
```

## Data format (`data/*.json`)
| Field | Description |
|---|---|
| `ticker`, `companyName` | Shown on hook & CTA |
| `hook` | Opening headline |
| `currency` | Prefix for prices, e.g. `$`, `₹` |
| `prices` | Array of closing prices (oldest → newest) |
| `periodLabel` | e.g. "Last 12 months" |
| `stats` | `[{ "label", "value" }]` – 3 recommended |
| `takeaways` | 3 short bullet strings |
| `cta`, `disclaimer` | Closing text |

Scene durations and colours live in `src/theme.ts`.

> `data/sample.json` uses a fictional company — always verify real figures before publishing.

---

# Scam Alert Shorts (Hindi)

A series of 45–50 second Hindi shorts on lesser-known frauds. Each one is 1080×1920 at 30 fps, with
a 2-second hook, scene visuals, on-screen headline text, burned-in voiceover captions and a share/follow outro.

| Episode | Composition ID | Status |
|---|---|---|
| 1. Mule account trap (48s) | `ScamEp1-MuleAccount` | ✅ built |
| 2. Fingerprint (AePS) fraud | – | todo |
| 3. Fake unclaimed money / insurance bonus | – | todo |
| 4. Fake IPO / institutional account groups | – | todo |
| 5. Call-merging OTP trick | – | todo |

```bash
npm run ep1          # silent version with captions -> out/ep1-mule-account.mp4
npm run studio       # preview / tweak in the browser (ScamAlert folder)
```

### Adding your voiceover
1. Record the Hindi voiceover following the scene timings in `src/scam/ep1/episode.tsx`
   (`from`/`to` seconds per scene). Total 48 s.
2. Save it as `public/audio/ep1.mp3`.
3. Run `npm run ep1:voice`.

Optional props (pass with `--props='{...}'`): `music` (file in `public/`), `musicVolume` (default 0.12),
`showSubtitles` (default true).

### Structure
- `src/scam/EpisodeVideo.tsx`: shared layout (header, scene timing, headline, captions, audio)
- `src/scam/StepCards.tsx`, `src/scam/Outro.tsx`: "3 steps" and "share and follow" scenes reused by every episode
- `src/scam/icons.tsx`: generic SVG icons only, with no real bank, police, RBI, SEBI or insurer logos
- `src/scam/epN/`: per-episode visuals and script data (`episode.tsx`)
- `captions/`: post captions with hashtags and source lines

Font: [Mukta](https://fonts.google.com/specimen/Mukta) (SIL OFL), bundled in `public/fonts`.

**Before posting:** confirm 1930 and cybercrime.gov.in again, and keep captions as awareness content, never investment advice.
