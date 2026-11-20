"""Generate a Hindi AI voiceover (one clip per scene) with Kokoro TTS.

Usage:
  pip install kokoro-onnx soundfile
  # model files from https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
  python scripts/voiceover.py ep1 --models /path/to/model-dir [--voice hm_omega] [--speed 1.15]

Writes public/audio/<ep>/scene-XX.mp3 and src/scam/<ep>/voice.json (clip durations),
which the "-AIVoice" composition uses to stretch each scene to fit its spoken line.
"""
import argparse, json, os, re, subprocess, sys
import soundfile as sf
from kokoro_onnx import Kokoro

# Spoken forms for things TTS reads badly
SPOKEN = [
    (r"\b1930\b", "उन्नीस सौ तीस"),
    (r"\bOTP\b", "ओ टी पी"),
    (r"\bPIN\b", "पिन"),
    (r"\bRBI\b", "आर बी आई"),
    (r"\bSEBI\b", "सेबी"),
    (r"\bIPO\b", "आई पी ओ"),
    (r"\bUPI\b", "यू पी आई"),
    (r"\bQR\b", "क्यू आर"),
    (r"\bCVV\b", "सी वी वी"),
    (r"\bSMS\b", "एस एम एस"),
    (r"\bAePS\b", "ए ई पी एस"),
    (r"cybercrime\.gov\.in", "साइबरक्राइम डॉट जीओवी डॉट इन"),
    (r"uidai\.gov\.in", "यू आई डी ए आई डॉट जीओवी डॉट इन"),
    (r"udgam\.rbi\.org\.in", "उद्गम डॉट आर बी आई डॉट ओ आर जी डॉट इन"),
    (r'["“”]', ""),
]

def spoken(text: str) -> str:
    for pat, rep in SPOKEN:
        text = re.sub(pat, rep, text)
    return text

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("episode")
    ap.add_argument("--models", required=True)
    ap.add_argument("--voice", default="hm_omega", help="hm_omega, hm_psi (male) / hf_alpha, hf_beta (female)")
    ap.add_argument("--speed", type=float, default=1.15)
    a = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    script = json.load(open(os.path.join(root, "src/scam", a.episode, "script.json"), encoding="utf-8"))
    out_dir = os.path.join(root, "public/audio", a.episode)
    os.makedirs(out_dir, exist_ok=True)
    k = Kokoro(os.path.join(a.models, "kokoro-v1.0.onnx"), os.path.join(a.models, "voices-v1.0.bin"))

    files, durations = [], []
    for i, sc in enumerate(script["scenes"], 1):
        text = spoken(sc["voiceover"])
        audio, sr = k.create(text, voice=a.voice, speed=a.speed, lang="hi")
        wav = os.path.join(out_dir, f"scene-{i:02d}.wav")
        sf.write(wav, audio, sr)
        mp3 = wav[:-4] + ".mp3"
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-b:a", "128k", mp3], check=True)
        os.remove(wav)
        files.append(f"audio/{a.episode}/scene-{i:02d}.mp3")
        durations.append(round(len(audio) / sr, 3))
        print(f"scene {i} {sc.get("id", "")}: {durations[-1]:.2f}s")

    meta = {"engine": "kokoro-v1.0", "voice": a.voice, "speed": a.speed, "files": files, "durations": durations}
    json.dump(meta, open(os.path.join(root, "src/scam", a.episode, "voice.json"), "w"), indent=2)
    print("total voice:", round(sum(durations), 1), "s")

if __name__ == "__main__":
    sys.exit(main())
