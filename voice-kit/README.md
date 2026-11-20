# Voice kit: Sarvam Bulbul multi-voice Hindi voiceover

A self-contained folder you can **copy into any repo**. It turns a script of lines (narrator plus characters)
into one clean MP3 per line, plus a timeline JSON, using [Sarvam AI](https://www.sarvam.ai) Bulbul.
A cache makes sure you only pay once per line.

```
voice-kit/
  sarvam_voice.py       # CLI + importable library (Python 3.9+, stdlib only)
  cast.json             # models -> speakers -> {voice, pace, fx}; default model + timing
  spoken.json           # pronunciation fixes (1930, OTP, RBI, website names, ...)
  example-script.json
```
Requirements: Python 3.9+ and `ffmpeg`/`ffprobe` on PATH. No pip packages are needed for Sarvam.

## 1. API key
1. Sign up at https://dashboard.sarvam.ai, then **API Keys** → create a key.
2. Local machine: `export SARVAM_API_KEY=your_key`. Never commit it; add it to `.env` / CI secrets instead.
3. Claude Code cloud sessions: nothing to do once the key is saved on the environment.
   The network proxy adds it to every request to `api.sarvam.ai`.

## 2. Use
```bash
# list the cast for the default model (bulbul:v4-flash)
python voice-kit/sarvam_voice.py voices

# one line -> one file
python voice-kit/sarvam_voice.py say narrator "नमस्ते दोस्तों!" -o hello.mp3

# whole script -> clips + timeline (check the cost first)
python voice-kit/sarvam_voice.py script voice-kit/example-script.json --out-dir out/audio --timeline out/voice.json --dry-run
python voice-kit/sarvam_voice.py script voice-kit/example-script.json --out-dir out/audio --timeline out/voice.json --file-prefix audio
```
From Python:
```python
import sys; sys.path.insert(0, "voice-kit")
from sarvam_voice import Voice
v = Voice()                                   # bulbul:v4-flash cast
v.render("narrator", "नमस्ते दोस्तों!", "hello.mp3")
print(v.summary())
```

## 3. Script format
```json
{ "tts": "bulbul:v4-flash",
  "scenes": [ { "id": "hook", "mood": "sting",
                "lines": [ { "who": "narrator", "text": "..." } ] } ] }
```
`who` must be a speaker in `cast.json` for that model. The timeline (`--timeline`) gives each scene's
`start`/`dur` and each line's `file`/`start`/`dur` in seconds. Use it to time video scenes or music.

## 4. Cast (`cast.json`)
**bulbul:v4-flash** (default, cheaper, style voices):

| speaker | voice | pace |
|---|---|---|
| narrator | simran_hi_narration | 1.15 |
| rahul | rahul_hi_conversational | 1.1 |
| scammer | mukul_hi_suspense (+ phone-line fx) | 1.0 |
| police | anand_hi_news | 1.05 |
| granny | suman_hi_companion | 1.0 |
| ramesh | mahesh_hi_documentary | 1.12 |
| neha | shreya_hi_conversational | 1.1 |
| sharma | ratan_hi_latenight_warm | 1.0 |
| pinky | ritu_hi_conversation | 1.12 |
| fakeofficer | shubh_hi_customer (+ phone fx) | 1.1 |
| expert | sunny_hi_ads | 1.1 |
| amit | tarun_hi_conversational | 1.1 |
| priya | sarika_hi_conversation | 1.1 |
| ivr | ishita_hi_banking (+ phone fx) | 1.0 |

`bulbul:v3` and `kokoro-v1.0` (free offline fallback) casts are included too.

Add a character by adding an entry under the model. `fx` is any ffmpeg audio filter chain
(for example `highpass=f=200,lowpass=f=3800` makes a voice sound like it's on a phone).
v4-flash voice names differ from v3 ones; asking for an invalid speaker makes the API list every valid name.

## 5. Keeping costs low
- **Cache:** raw clips are stored in `.tts-cache/` (add it to `.gitignore`), keyed by (model, voice, pace, text).
  Re-runs only bill **new or edited** lines. Changing `fx`, timing or visuals costs nothing.
- **`--dry-run`:** prints each line that would be billed and the character total, and calls nothing.
- **Pace:** a slightly faster pace means shorter audio. Billing is per character, not per second.
