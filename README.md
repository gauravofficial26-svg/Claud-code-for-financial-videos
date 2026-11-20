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

A series of animated Hindi story shorts, about one minute each, on lesser-known frauds. Each one is 1080×1920 at 30 fps.
Each episode follows a character, so it plays as a short story rather than an infographic, with a narrator and separate character voices (AI Hindi),
suspense music that follows the story, quiet sound effects and burned-in captions with speaker tags.

| Episode | Composition ID | Status |
|---|---|---|
| 1. Mule account trap: Rahul's story (~83s) | `ScamEp1-MuleAccount` | ✅ built |
| 2. Fingerprint (AePS) fraud | – | todo |
| 3. Fake unclaimed money / insurance bonus | – | todo |
| 4. Fake IPO / institutional account groups | – | todo |
| 5. Call-merging OTP trick | – | todo |

```bash
npm run ep1          # render -> out/ep1-mule-account.mp4
npm run ep1:final    # normalise loudness to -14 LUFS (YouTube) -> out/ep1-mule-account-final.mp4
npm run studio       # preview / tweak in the browser (ScamAlert folder; Dev/CharSheet shows all characters)
```

### Voices, music and sound
Each episode is written as **lines spoken by a narrator and the characters** in `src/scam/ep1/script.json`:
```json
{ "id": "station", "mood": "dark", "lines": [
  { "who": "police",   "text": "तुम्हारे खाते से ठगी का पैसा आगे गया है।" },
  { "who": "rahul",    "text": "सर, मुझे सच में नहीं पता था!" },
  { "who": "narrator", "text": "..." } ] }
```
| Speaker | Voice |
|---|---|
| narrator | female (`hf_alpha`), calm and clear |
| rahul | young male (`hm_omega`), slightly brighter |
| scammer | deep male (`hm_psi`), pitched down, phone-line filter |
| police | firm male (`hm_psi`), slightly deeper |
| granny | female (`hf_beta`), pitched down, slight tremble |

Generate the voices, then the score:
```bash
pip install kokoro-onnx soundfile numpy scipy
# download kokoro-v1.0.onnx + voices-v1.0.bin from the kokoro-onnx "model-files-v1.0" release
npm run voice -- ep1 --models /path/to/models   # -> public/audio/ep1/l-*.mp3 + src/scam/ep1/voice.json
npm run music -- ep1                            # -> public/audio/ep1/music.mp3
npm run ep1 && npm run ep1:final
```
- **Timing:** every scene lasts as long as its lines, and the animations (mouths, chat bubbles, knocks, bars) are cued to the lines.
- **Music** (`scripts/music.py`) is generated to the same timeline, with one mood per scene: `sting`, `tension` (ticking clock and drone), `light`, `dark` (heartbeat and clashing drone), `hope` (warm chords). It drops automatically whenever someone speaks.
- **Sound effects** play at a low level (`sfxVolume` 0.3) so they never cover the voice.
- `scripts/voiceover.py` rewrites 1930, OTP, PIN, RBI and website names into their spoken forms.
- **Your own recordings:** replace the `l-XX-Y.mp3` files and update their `dur` in `voice.json`.

Props (`--props='{...}'`): `useVoice`, `useMusic`, `musicVolume` (0.5), `sfxVolume` (0.3), `showSubtitles`.

### Structure
- `src/scam/characters.tsx`: flat animated people (Rahul, granny, scammer, police, friends, parents) with blinking, expressions, talking mouths and arm poses
- `src/scam/sets.tsx`: room, phone close-up in a hand, chat bubbles, notifications, police station, lock-up bars, camera push-in
- `src/scam/EpisodeVideo.tsx`: header, voice timeline, captions, music
- `src/scam/Sfx.tsx` + `public/sfx/`: synthesised sound effects (ping, buzz, knock, slam, whoosh, pop)
- `src/scam/epN/`: per-episode story scenes (`visuals.tsx`), lines (`script.json`) and voice timings
- `captions/`: post captions with hashtags and source lines

All people and places are generic, with no real bank, police, RBI, SEBI or insurer logos. The source line notes that the story is fictional.
Font: [Mukta](https://fonts.google.com/specimen/Mukta) (SIL OFL), bundled in `public/fonts`.

**Before posting:** confirm 1930 and cybercrime.gov.in again, and keep captions as awareness content, never investment advice.
