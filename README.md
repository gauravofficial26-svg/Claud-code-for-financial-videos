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
Each episode follows a character, so it plays as a short story rather than an infographic, with a narrator and separate character voices (Sarvam Bulbul v4-flash Hindi TTS),
suspense music that follows the story, quiet sound effects and burned-in captions with speaker tags.

| Episode | Composition ID | Story | Length | Voices |
|---|---|---|---|---|
| 1. Mule account trap | `ScamEp1-MuleAccount` | Rahul rents out his account | ~89s | Bulbul v3 |
| 2. Fingerprint (AePS) fraud | `ScamEp2-AePS` | Ramesh ji's thumbprint is cloned from a registry | ~49s | v4-flash |
| 3. Fake unclaimed money / insurance bonus | `ScamEp3-UnclaimedMoney` | Sharma ji gets a fake "RBI officer" call | ~54s | v4-flash |
| 4. Fake IPO / institutional account groups | `ScamEp4-FakeIPO` | Amit joins a "guaranteed IPO" group | ~55s | v4-flash |
| 5. Call-merging OTP trick | `ScamEp5-CallMerge` | Priya merges a call and loses her OTP | ~54s | v4-flash |

```bash
npm run ep2          # render -> out/ep2.mp4   (ep1 ... ep5)
npm run ep2:final    # normalise loudness to -14 LUFS (YouTube) -> out/ep2-final.mp4
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
Voices come from **[Sarvam AI](https://www.sarvam.ai) `bulbul:v4-flash`** (cheaper than v3, with style-specific voices) by default.
Kokoro remains as a free offline fallback (`--engine kokoro --models <dir>`).

| Speaker | v4-flash voice | Pace |
|---|---|---|
| narrator | `simran_hi_narration` | 1.15 |
| rahul | `rahul_hi_conversational` | 1.1 |
| scammer | `mukul_hi_suspense`, with a light phone-line filter | 1.0 |
| police | `anand_hi_news` | 1.05 |
| granny | `suman_hi_companion`, with a slight tremble | 1.0 |

Change the cast in `SARVAM_SPEAKERS` in `scripts/voiceover.py`. Other useful v4-flash Hindi voices include
`tanya_hi_narration`, `shilpa_hi_narration`, `roopa_hi_narration`, `mahesh_hi_documentary`, `ratan_hi_latenight`,
`shubh_hi_stories_dramatic`, `aditya_hi_conversational`, `ritu_hi_conversation` and `sarika_hi_conversation`.
(v4-flash voices differ from v3 ones; an invalid name makes the API list them all.)

**Keeping costs low**
- Run `npm run voice -- ep1 --dry-run` first. It lists the lines that need new audio and the characters that would be billed, and calls nothing.
- Raw clips are cached in `.tts-cache/` by (model, voice, pace, text), so re-runs **only pay for new or edited lines**.
  Changing effects, music or visuals and re-rendering costs nothing.
- Episode 1 is about 1,100 characters in total.
- Rendering (Remotion), music (`scripts/music.py`) and sound effects are all local and free.

Generate the voices, then the score:
```bash
# 1. Get an API key: sign up at https://dashboard.sarvam.ai, then API Keys -> create key
export SARVAM_API_KEY=your_key          # (Claude cloud sessions inject it automatically)
pip install numpy scipy soundfile
npm run voice -- ep1                    # -> public/audio/ep1/l-*.mp3 + src/scam/ep1/voice.json
npm run music -- ep1                    # -> public/audio/ep1/music.mp3
npm run ep1 && npm run ep1:final
```

### Making a new episode
1. Write `src/scam/epN/script.json` with scenes, a `mood` per scene and lines per speaker. Open with a 2-line hook: a character's shock line, then the narrator's punch line.
2. Add any new characters to `LOOKS` in `characters.tsx`, to `SARVAM_CASTS` in `scripts/voiceover.py` and to `SPEAKER_TAG` in `Subtitles.tsx`.
3. Run `npm run voice -- epN --dry-run` to check the cost, then `npm run voice -- epN`, then `npm run music -- epN`.
4. Write the scene visuals in `src/scam/epN/visuals.tsx`, reusing `kit.tsx` (StepsScene, OutroScene, Stamp, PopCard, ChipX) and `props.tsx`.
   Register the episode with `makeEpisode` in `epN/episode.ts`, add it to `Root.tsx`, and add the `epN` scripts to `package.json`.
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
- `src/scam/kit.tsx`, `src/scam/props.tsx`: shared scene helpers and props (fingerprint, scanner, call screen, trading app, etc.)
- `src/scam/epN/`: per-episode story scenes (`visuals.tsx`), lines (`script.json`) and voice timings
- `captions/`: post captions with hashtags and source lines

All people and places are generic, with no real bank, police, RBI, SEBI or insurer logos. The source line notes that the story is fictional.
Font: [Mukta](https://fonts.google.com/specimen/Mukta) (SIL OFL), bundled in `public/fonts`.

**Before posting:** confirm 1930 and cybercrime.gov.in again, and keep captions as awareness content, never investment advice.
