"""Sarvam Bulbul voice kit: multi-voice Hindi voiceover with a cost-saving cache.

Portable: copy the whole voice-kit/ folder into any repo. Needs Python 3.9+ and ffmpeg/ffprobe on PATH.
No pip packages are needed for Sarvam (Kokoro fallback: pip install kokoro-onnx soundfile).

API key
  Get one at https://dashboard.sarvam.ai -> API Keys.
  Locally:              export SARVAM_API_KEY=your_key      (never commit it)
  Claude cloud session: nothing to do, the network proxy adds the saved key for api.sarvam.ai.

1) One line -> one file
  python voice-kit/sarvam_voice.py say narrator "नमस्ते दोस्तों!" -o hello.mp3

2) A whole script -> one clip per line + a timeline JSON
  python voice-kit/sarvam_voice.py script my/script.json --out-dir public/audio/ep1 \
         --timeline my/voice.json --file-prefix audio/ep1 [--dry-run]

  script.json:
    { "tts": "bulbul:v4-flash",            # optional, else cast.json default_model
      "scenes": [ { "id": "hook", "mood": "sting",
                    "lines": [ { "who": "narrator", "text": "..." } ] } ] }
  `who` must be a speaker in cast.json for that model.

Cost saving
  Raw clips are cached in .tts-cache/ (or --cache) by (model, voice, pace, text).
  Re-runs only bill new/edited lines; changing fx, timing or visuals is free.
  --dry-run lists what would be billed and calls nothing.
"""
import argparse, base64, hashlib, json, os, re, shutil, subprocess, sys, urllib.error, urllib.request

KIT = os.path.dirname(os.path.abspath(__file__))
API = "https://api.sarvam.ai/text-to-speech"
CLEAN = "silenceremove=start_periods=1:start_threshold=-50dB,areverse,silenceremove=start_periods=1:start_threshold=-50dB,areverse,loudnorm=I=-16:TP=-2"


def load_json(path):
    with open(path, encoding="utf-8") as f:
        return json.load(f)


class Voice:
    def __init__(self, model=None, cast_path=None, spoken_path=None, cache_dir=".tts-cache", models_dir=None, dry_run=False):
        self.cfg = load_json(cast_path or os.path.join(KIT, "cast.json"))
        self.model = model or self.cfg["default_model"]
        if self.model not in self.cfg["casts"]:
            sys.exit(f"No cast for model {self.model!r} in cast.json (have: {', '.join(self.cfg['casts'])})")
        self.cast = self.cfg["casts"][self.model]
        self.spoken_map = [(re.compile(p), r) for p, r in load_json(spoken_path or os.path.join(KIT, "spoken.json"))]
        self.cache_dir = cache_dir
        self.dry_run = dry_run
        self.models_dir = models_dir
        self.stats = {"cached": 0, "new": 0, "chars": 0}
        self._kokoro = None
        os.makedirs(cache_dir, exist_ok=True)

    def spoken(self, text):
        for pat, rep in self.spoken_map:
            text = pat.sub(rep, text)
        return text

    def speaker(self, who):
        if who not in self.cast:
            sys.exit(f"Speaker {who!r} is not in the {self.model} cast. Add it to cast.json.")
        return self.cast[who]

    def raw(self, who, text):
        """Return path of the raw (cached) clip, synthesizing if needed. None on dry-run miss."""
        sp = self.speaker(who)
        text = self.spoken(text)
        key = hashlib.sha1(json.dumps([self.model, sp["voice"], sp.get("pace", sp.get("speed")), text], ensure_ascii=False).encode()).hexdigest()[:16]
        path = os.path.join(self.cache_dir, key + ".wav")
        if os.path.exists(path):
            self.stats["cached"] += 1
            return path
        self.stats["new"] += 1
        self.stats["chars"] += len(text)
        if self.dry_run:
            print(f"   would synthesize ({len(text)} chars) [{who}]: {text}")
            return None
        if self.model.startswith("kokoro"):
            self._kokoro_tts(sp, text, path)
        else:
            self._sarvam_tts(sp, text, path)
        return path

    def _sarvam_tts(self, sp, text, path):
        body = {"text": text, "target_language_code": self.cfg.get("language", "hi-IN"), "model": self.model, "speaker": sp["voice"],
                "pace": sp.get("pace", 1.0), "speech_sample_rate": self.cfg.get("sample_rate", 44100), "enable_preprocessing": True}
        req = urllib.request.Request(API, json.dumps(body).encode(), {
            "api-subscription-key": os.environ.get("SARVAM_API_KEY", "proxy-injected"), "Content-Type": "application/json"})
        try:
            d = json.load(urllib.request.urlopen(req, timeout=120))
        except urllib.error.HTTPError as e:
            sys.exit(f"Sarvam API error {e.code}: {e.read().decode(errors='replace')[:400]}")
        with open(path, "wb") as f:
            f.write(base64.b64decode(d["audios"][0]))

    def _kokoro_tts(self, sp, text, path):
        import soundfile as sf
        from kokoro_onnx import Kokoro
        if self._kokoro is None:
            if not self.models_dir:
                sys.exit("Kokoro needs --models <dir with kokoro-v1.0.onnx and voices-v1.0.bin>")
            self._kokoro = Kokoro(os.path.join(self.models_dir, "kokoro-v1.0.onnx"), os.path.join(self.models_dir, "voices-v1.0.bin"))
        audio, sr = self._kokoro.create(text, voice=sp["voice"], speed=sp.get("speed", 1.0), lang="hi")
        sf.write(path, audio, sr)

    def render(self, who, text, out_mp3):
        """Synthesize (or reuse) and write a cleaned, loudness-normalised mp3. Returns duration in s, or None on dry-run."""
        raw = self.raw(who, text)
        if raw is None:
            return None
        fx = ",".join(x for x in [self.speaker(who).get("fx", ""), CLEAN] if x)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", raw, "-af", fx, "-ar", "44100", "-b:a", "160k", out_mp3], check=True)
        out = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out_mp3], capture_output=True, text=True, check=True)
        return round(float(out.stdout.strip()), 3)

    def summary(self):
        s = self.stats
        return f"TTS ({self.model}): {s['new']} new line(s), {s['chars']} chars billed; {s['cached']} reused from cache"


def run_script(script_path, out_dir, timeline_path, file_prefix, model=None, **kw):
    script = load_json(script_path)
    v = Voice(model=model or script.get("tts"), **kw)
    lead, gap, tail = (v.cfg.get("timing", {}).get(k, d) for k, d in (("lead", 0.12), ("gap", 0.18), ("tail", 0.3)))
    os.makedirs(out_dir, exist_ok=True)
    if not v.dry_run:
        for f in os.listdir(out_dir):
            if f.startswith("l-") and f.endswith(".mp3"):
                os.remove(os.path.join(out_dir, f))
    t, scenes = 0.0, []
    for si, sc in enumerate(script["scenes"], 1):
        cursor, lines = lead, []
        for li, ln in enumerate(sc["lines"], 1):
            name = f"l-{si:02d}-{li}.mp3"
            d = v.render(ln["who"], ln["text"], os.path.join(out_dir, name))
            if d is None:
                continue
            lines.append({"who": ln["who"], "text": ln["text"], "file": f"{file_prefix.rstrip('/')}/{name}", "start": round(cursor, 3), "dur": d})
            cursor += d + gap
        dur = round(cursor - gap + tail, 3)
        scenes.append({"id": sc["id"], "mood": sc.get("mood", "tension"), "start": round(t, 3), "dur": dur, "lines": lines})
        if not v.dry_run:
            print(f"scene {si:2d} {sc['id']:<10} {dur:5.2f}s  " + " | ".join(f"{l['who']} {l['dur']:.1f}" for l in lines))
        t += dur
    print(v.summary())
    if v.dry_run:
        return
    meta = {"engine": v.model, "speakers": v.cast, "total": round(t, 3), "scenes": scenes}
    with open(timeline_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print("total:", round(t, 1), "s ->", timeline_path)


def main(argv=None):
    ap = argparse.ArgumentParser(description="Sarvam Bulbul voice kit")
    common = argparse.ArgumentParser(add_help=False)
    common.add_argument("--model", help="override model, e.g. bulbul:v4-flash, bulbul:v3, kokoro-v1.0")
    common.add_argument("--cast", help="path to cast.json (default: next to this file)")
    common.add_argument("--spoken", help="path to spoken.json (default: next to this file)")
    common.add_argument("--cache", default=".tts-cache", help="raw clip cache dir (default .tts-cache)")
    common.add_argument("--models", help="Kokoro model dir (only for kokoro-v1.0)")
    common.add_argument("--dry-run", action="store_true", help="show what would be billed; call nothing")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s1 = sub.add_parser("say", parents=[common], help="one line -> one mp3")
    s1.add_argument("who"); s1.add_argument("text"); s1.add_argument("-o", "--out", default="line.mp3")
    s2 = sub.add_parser("script", parents=[common], help="script.json -> clips + timeline")
    s2.add_argument("script"); s2.add_argument("--out-dir", required=True); s2.add_argument("--timeline", required=True)
    s2.add_argument("--file-prefix", default="", help="path prefix stored in the timeline for each clip")
    s3 = sub.add_parser("voices", parents=[common], help="list the cast for a model")
    a = ap.parse_args(argv)
    kw = dict(cast_path=a.cast, spoken_path=a.spoken, cache_dir=a.cache, models_dir=a.models, dry_run=a.dry_run)
    if a.cmd == "say":
        v = Voice(model=a.model, **kw)
        d = v.render(a.who, a.text, a.out)
        print(v.summary() + (f"\n{a.out} ({d}s)" if d else ""))
    elif a.cmd == "script":
        run_script(a.script, a.out_dir, a.timeline, a.file_prefix or a.out_dir, model=a.model, **kw)
    else:
        v = Voice(model=a.model, **kw)
        for who, sp in v.cast.items():
            print(f"{who:<12} {sp['voice']:<26} pace {sp.get('pace', sp.get('speed'))}")


if __name__ == "__main__":
    main()
