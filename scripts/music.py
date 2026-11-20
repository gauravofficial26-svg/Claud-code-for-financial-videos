"""Generate a suspense score that follows an episode's voice timeline.

Usage: pip install numpy scipy soundfile
       python scripts/music.py ep1
Reads src/scam/<ep>/voice.json (scene start/dur + mood) and writes public/audio/<ep>/music.mp3.
Moods: sting, tension, light, dark, hope.
"""
import json, os, subprocess, sys
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt

SR = 44100
rng = np.random.default_rng(7)

def note(n):  # MIDI -> Hz
    return 440.0 * 2 ** ((n - 69) / 12)

def lp(x, f):
    return sosfilt(butter(2, f, "low", fs=SR, output="sos"), x)

def hp(x, f):
    return sosfilt(butter(2, f, "high", fs=SR, output="sos"), x)

def env(n, a=0.01, r=0.3):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))

def warm(f, t, harm=6, detune=0.003):
    out = np.zeros_like(t)
    for d in (-detune, 0, detune):
        for k in range(1, harm + 1):
            out += np.sin(2 * np.pi * f * (1 + d) * k * t + k) / k ** 1.4
    return out / 3

def pluck(f, dur=0.9, bright=0.4):
    t = np.arange(int(dur * SR)) / SR
    x = np.sin(2 * np.pi * f * t) + bright * np.sin(4 * np.pi * f * t) * np.exp(-t * 6)
    return x * env(len(t), 0.004, dur / 4)

def kick(f0=110, f1=42, dur=0.35):
    t = np.arange(int(dur * SR)) / SR
    freq = f1 + (f0 - f1) * np.exp(-t * 25)
    return np.sin(2 * np.pi * np.cumsum(freq) / SR) * env(len(t), 0.002, 0.12)

def tick(pitch=1.0):
    n = int(0.03 * SR)
    x = hp(rng.standard_normal(n), 3000 * pitch) * np.exp(-np.arange(n) / SR * 300)
    return x

def place(buf, x, at):
    i = int(at * SR)
    if i >= len(buf):
        return
    j = min(len(buf), i + len(x))
    buf[i:j] += x[: j - i]

def section(mood, dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    out = np.zeros(n)
    if mood in ("tension", "sting"):
        out += 0.30 * lp(warm(note(33), t) + 0.7 * warm(note(40), t), 500) * (0.8 + 0.2 * np.sin(2 * np.pi * 0.2 * t))
        bpm = 84
        for b in range(int(dur * bpm / 60) + 1):
            place(out, 0.20 * tick(1.0 if b % 2 == 0 else 0.7), b * 60 / bpm)
        motif = [69, 72, 76, 74, 72, 69, 68, 69]
        for i, m in enumerate(motif):
            at = 1.2 + i * 60 / bpm * 2
            if at < dur - 0.5:
                place(out, 0.16 * lp(pluck(note(m), 1.6, 0.2), 3000), at)
        if mood == "sting":
            place(out, 0.9 * kick(90, 30, 1.6), 0)
            place(out, 0.25 * lp(rng.standard_normal(int(1.2 * SR)) * env(int(1.2 * SR), 0.005, 0.4), 800), 0)
    elif mood == "light":
        bpm = 104
        seq = [57, 60, 64, 60, 59, 62, 65, 62]
        for b in range(int(dur * bpm / 60 * 2) + 1):
            place(out, 0.22 * lp(pluck(note(seq[b % len(seq)]), 0.35, 0.6), 2500), b * 30 / bpm)
            if b % 4 == 0:
                place(out, 0.35 * kick(), b * 30 / bpm)
        out += 0.10 * lp(warm(note(45), t), 400)
    elif mood == "dark":
        out += 0.30 * lp(warm(note(33), t) + 0.8 * warm(note(34), t), 380)
        out += 0.05 * np.sin(2 * np.pi * note(81) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 6 * t)) * np.minimum(1, t / 2)
        out += 0.04 * np.sin(2 * np.pi * note(82) * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 5 * t + 1)) * np.minimum(1, t / 3)
        bpm = 72
        for b in range(int(dur * bpm / 60) + 1):
            at = b * 60 / bpm
            place(out, 0.55 * lp(kick(80, 40, 0.3), 200), at)
            place(out, 0.35 * lp(kick(75, 38, 0.25), 200), at + 0.2)
        swell = lp(rng.standard_normal(n), 1200) * np.minimum(1, t / dur) ** 2 * 0.05
        out += swell
    elif mood == "hope":
        chords = [[48, 52, 55, 60], [45, 48, 52, 57], [41, 45, 48, 53], [43, 47, 50, 55]]  # C Am F G
        bar = 60 / 92 * 4
        for ci in range(int(dur / bar) + 1):
            ch = chords[ci % 4]
            s, e = int(ci * bar * SR), min(n, int((ci + 1) * bar * SR))
            if s >= n:
                break
            tt = t[s:e]
            pad = sum(warm(note(m), tt, 4) for m in ch) / 4
            out[s:e] += 0.22 * lp(pad, 1400) * np.minimum(1, (tt - tt[0]) / 0.3)
            for k in range(8):
                place(out, 0.12 * pluck(note(ch[k % 4] + 12), 0.5, 0.3), ci * bar + k * bar / 8)
            place(out, 0.25 * kick(), ci * bar)
            place(out, 0.25 * kick(), ci * bar + bar / 2)
    return out

def main():
    ep = sys.argv[1]
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    meta = json.load(open(os.path.join(root, "src/scam", ep, "voice.json"), encoding="utf-8"))
    total = meta["total"] + 0.5
    mix = np.zeros(int(total * SR))
    xf = 0.6  # crossfade seconds
    for sc in meta["scenes"]:
        start = max(0.0, sc["start"] - xf / 2)
        dur = sc["dur"] + xf
        x = section(sc["mood"], dur)
        fade = np.ones(len(x))
        k = int(xf * SR)
        fade[:k] = np.linspace(0, 1, k) if sc["start"] > 0 else 1
        fade[-k:] = np.linspace(1, 0, k)
        place(mix, x * fade, start)
    mix = lp(hp(mix, 30), 9000)
    mix /= np.max(np.abs(mix)) + 1e-9
    mix *= 0.8
    out_dir = os.path.join(root, "public/audio", ep)
    wav = os.path.join(out_dir, "music.wav")
    sf.write(wav, np.stack([mix, np.roll(mix, 300)], axis=1), SR)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-af", "loudnorm=I=-18:TP=-2", "-ar", "44100", "-b:a", "192k", os.path.join(out_dir, "music.mp3")], check=True)
    os.remove(wav)
    print("music:", round(total, 1), "s ->", os.path.join("public/audio", ep, "music.mp3"))

if __name__ == "__main__":
    main()
