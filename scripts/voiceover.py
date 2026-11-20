"""Generate an episode's multi-voice Hindi voiceover using voice-kit/ (Sarvam Bulbul).

  python scripts/voiceover.py ep2 --dry-run   # show what would be billed, call nothing
  python scripts/voiceover.py ep2
  python scripts/voiceover.py ep1 --engine kokoro --models /path/to/kokoro-models   # offline fallback

Reads  src/scam/<ep>/script.json   (optional "tts": model; scenes -> lines -> {who, text})
Writes public/audio/<ep>/l-<scene>-<line>.mp3 and src/scam/<ep>/voice.json (timeline)
Voices, pace and effects live in voice-kit/cast.json; pronunciation fixes in voice-kit/spoken.json.
"""
import argparse, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "voice-kit"))
from sarvam_voice import run_script  # noqa: E402


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--engine", choices=["sarvam", "kokoro"], default="sarvam")
    ap.add_argument("--models", help="kokoro model dir")
    ap.add_argument("--dry-run", action="store_true")
    a = ap.parse_args()
    ep = a.episode
    run_script(
        os.path.join(ROOT, "src/scam", ep, "script.json"),
        out_dir=os.path.join(ROOT, "public/audio", ep),
        timeline_path=os.path.join(ROOT, "src/scam", ep, "voice.json"),
        file_prefix=f"audio/{ep}",
        model="kokoro-v1.0" if a.engine == "kokoro" else None,
        cache_dir=os.path.join(ROOT, ".tts-cache"),
        models_dir=a.models,
        dry_run=a.dry_run,
    )


if __name__ == "__main__":
    main()
