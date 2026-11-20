"""Generate a multi-voice Hindi voiceover (narrator + characters).

Engines:
  sarvam (default, realistic): Sarvam AI Bulbul. New episodes use bulbul:v4-flash (cheaper);
      an episode can pin a model with "tts": "bulbul:v3" in its script.json (Episode 1 does).
      Needs an API key from dashboard.sarvam.ai.
      export SARVAM_API_KEY=...        (in Claude cloud sessions the proxy injects it; leave unset)
      python scripts/voiceover.py ep1 --dry-run   # show what would be billed, call nothing
      python scripts/voiceover.py ep1

Cost saving: raw TTS clips are cached in .tts-cache/ by (model, voice, pace, text).
Re-running only pays for lines that are new or edited; changing effects/timing is free.
  kokoro (offline fallback):
      pip install kokoro-onnx soundfile
      # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
      python scripts/voiceover.py ep1 --engine kokoro --models /path/to/model-dir

Reads  src/scam/<ep>/script.json   (scenes -> lines -> {who, text})
Writes public/audio/<ep>/l-<scene>-<line>.mp3 and src/scam/<ep>/voice.json
       (scene + line start/duration in seconds; the video and music follow this timeline)
"""
import argparse, base64, hashlib, json, os, re, shutil, subprocess, sys, urllib.request

DEFAULT_MODEL = "bulbul:v4-flash"  # default for new episodes (cheaper)

# Cast per Sarvam model: speaker, pace, and a light ffmpeg filter
SARVAM_CASTS = {
    "bulbul:v4-flash": {
        "narrator": {"voice": "simran_hi_narration", "pace": 1.15, "fx": "highpass=f=70"},
        "rahul":    {"voice": "rahul_hi_conversational", "pace": 1.1, "fx": "highpass=f=70"},
        "scammer":  {"voice": "mukul_hi_suspense", "pace": 1.0, "fx": "highpass=f=140,lowpass=f=5500,aecho=0.8:0.5:35:0.1"},
        "police":   {"voice": "anand_hi_news", "pace": 1.05, "fx": "highpass=f=60"},
        "granny":   {"voice": "suman_hi_companion", "pace": 1.0, "fx": "highpass=f=80,vibrato=f=5:d=0.06"},
    },
    "bulbul:v3": {  # Episode 1
        "narrator": {"voice": "neha", "pace": 1.3, "fx": "highpass=f=70"},
        "rahul":    {"voice": "rahul", "pace": 1.15, "fx": "highpass=f=70"},
        "scammer":  {"voice": "varun", "pace": 1.08, "fx": "highpass=f=150,lowpass=f=5000,aecho=0.8:0.5:35:0.12"},
        "police":   {"voice": "aditya", "pace": 1.12, "fx": "highpass=f=60"},
        "granny":   {"voice": "kavitha", "pace": 1.15, "fx": "highpass=f=80,vibrato=f=5:d=0.08"},
    },
}

# Cast for Kokoro (offline): base voice, speed, and an ffmpeg filter for character
KOKORO_SPEAKERS = {
    "narrator": {"voice": "hf_alpha", "speed": 1.2, "fx": "highpass=f=70,acompressor=threshold=-18dB:ratio=3:attack=5:release=80"},
    "rahul":    {"voice": "hm_omega", "speed": 1.18, "fx": "asetrate=24000*1.04,aresample=24000,atempo=1/1.04"},
    "scammer":  {"voice": "hm_psi",   "speed": 1.05, "fx": "asetrate=24000*0.86,aresample=24000,atempo=1/0.86,highpass=f=180,lowpass=f=3600,aecho=0.8:0.6:40:0.15"},
    "police":   {"voice": "hm_psi",   "speed": 1.12, "fx": "asetrate=24000*0.93,aresample=24000,atempo=1/0.93,acompressor=threshold=-20dB:ratio=3"},
    "granny":   {"voice": "hf_beta",  "speed": 1.02, "fx": "asetrate=24000*0.94,aresample=24000,atempo=1/0.94,vibrato=f=5.5:d=0.25"},
}

LEAD, GAP, TAIL = 0.12, 0.18, 0.3  # seconds: before first line, between lines, after last line

# Spoken forms for things TTS can misread
SPOKEN = [
    (r"\b1930\b", "उन्नीस सौ तीस"), (r"\bOTP\b", "ओ टी पी"), (r"\bPIN\b", "पिन"), (r"\bRBI\b", "आर बी आई"),
    (r"\bSEBI\b", "सेबी"), (r"\bIPO\b", "आई पी ओ"), (r"\bUPI\b", "यू पी आई"), (r"\bQR\b", "क्यू आर"),
    (r"\bCVV\b", "सी वी वी"), (r"\bSMS\b", "एस एम एस"), (r"\bAePS\b", "ए ई पी एस"),
    (r"cybercrime\.gov\.in", "साइबरक्राइम डॉट जीओवी डॉट इन"), (r"uidai\.gov\.in", "यू आई डी ए आई डॉट जीओवी डॉट इन"),
    (r"udgam\.rbi\.org\.in", "उद्गम डॉट आर बी आई डॉट ओ आर जी डॉट इन"), (r'["“”]', ""), (r"\.\.\.", ","),
]

def spoken(text: str) -> str:
    for pat, rep in SPOKEN:
        text = re.sub(pat, rep, text)
    return text

def duration(path: str) -> float:
    out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", path], capture_output=True, text=True, check=True)
    return round(float(out.stdout.strip()), 3)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--engine", choices=["sarvam", "kokoro"], default="sarvam")
    ap.add_argument("--models", help="kokoro model dir")
    ap.add_argument("--dry-run", action="store_true", help="list lines that need synthesis and the characters billed; call nothing")
    a = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    script = json.load(open(os.path.join(root, "src/scam", a.episode, "script.json"), encoding="utf-8"))
    out_dir = os.path.join(root, "public/audio", a.episode)
    os.makedirs(out_dir, exist_ok=True)
    if not a.dry_run:
        for f in os.listdir(out_dir):
            if f.endswith(".mp3") and (f.startswith("l-") or f.startswith("scene-")):
                os.remove(os.path.join(out_dir, f))
    sarvam_model = script.get("tts", DEFAULT_MODEL)
    speakers = SARVAM_CASTS[sarvam_model] if a.engine == "sarvam" else KOKORO_SPEAKERS
    if a.engine == "kokoro":
        import soundfile as sf
        from kokoro_onnx import Kokoro
        k = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))

    cache_dir = os.path.join(root, ".tts-cache")
    os.makedirs(cache_dir, exist_ok=True)
    stats = {"cached": 0, "new": 0, "chars": 0}

    def synth(sp, text, wav):
        model = sarvam_model if a.engine == "sarvam" else "kokoro-v1.0"
        key = hashlib.sha1(json.dumps([model, sp["voice"], sp.get("pace", sp.get("speed")), text], ensure_ascii=False).encode()).hexdigest()[:16]
        cached = os.path.join(cache_dir, key + ".wav")
        if os.path.exists(cached):
            stats["cached"] += 1
            shutil.copy(cached, wav)
            return True
        stats["new"] += 1
        stats["chars"] += len(text)
        if a.dry_run:
            print(f"   would synthesize ({len(text)} chars): {text}")
            return False
        _synth(sp, text, cached)
        shutil.copy(cached, wav)
        return True

    def _synth(sp, text, wav):
        if a.engine == "sarvam":
            body = {"text": text, "target_language_code": "hi-IN", "model": sarvam_model, "speaker": sp["voice"],
                    "pace": sp["pace"], "speech_sample_rate": 44100, "enable_preprocessing": True}
            req = urllib.request.Request("https://api.sarvam.ai/text-to-speech", json.dumps(body).encode(),
                                         {"api-subscription-key": os.environ.get("SARVAM_API_KEY", "proxy-injected"), "Content-Type": "application/json"})
            d = json.load(urllib.request.urlopen(req, timeout=120))
            open(wav, "wb").write(base64.b64decode(d["audios"][0]))
        else:
            audio, sr = k.create(text, voice=sp["voice"], speed=sp["speed"], lang="hi")
            sf.write(wav, audio, sr)

    t = 0.0
    scenes = []
    for si, sc in enumerate(script["scenes"], 1):
        cursor = LEAD
        lines = []
        for li, ln in enumerate(sc["lines"], 1):
            sp = speakers[ln["who"]]
            wav = os.path.join(out_dir, "tmp.wav")
            if not synth(sp, spoken(ln["text"]), wav):
                continue
            name = f"l-{si:02d}-{li}.mp3"
            mp3 = os.path.join(out_dir, name)
            fx = sp["fx"] + ",silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-2"
            subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", fx, "-ar", "44100", "-b:a", "160k", mp3], check=True)
            os.remove(wav)
            d = duration(mp3)
            lines.append({"who": ln["who"], "text": ln["text"], "file": f"audio/{a.episode}/{name}", "start": round(cursor, 3), "dur": d})
            cursor += d + GAP
        dur = round(cursor - GAP + TAIL, 3)
        scenes.append({"id": sc["id"], "mood": sc.get("mood", "tension"), "start": round(t, 3), "dur": dur, "lines": lines})
        print(f"scene {si:2d} {sc['id']:<10} {dur:5.2f}s  " + " | ".join(f"{l['who']} {l['dur']:.1f}" for l in lines))
        t += dur

    print(f"TTS: {stats['new']} new line(s), {stats['chars']} chars billed; {stats['cached']} reused from cache")
    if a.dry_run:
        return
    meta = {"engine": sarvam_model if a.engine == "sarvam" else "kokoro-v1.0", "speakers": speakers, "total": round(t, 3), "scenes": scenes}
    json.dump(meta, open(os.path.join(root, "src/scam", a.episode, "voice.json"), "w"), ensure_ascii=False, indent=2)
    print("total:", round(t, 1), "s")

if __name__ == "__main__":
    sys.exit(main())
