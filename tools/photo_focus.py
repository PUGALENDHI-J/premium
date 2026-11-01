"""Find where the subject of each site photo is, so cropped cards and heroes keep faces and tall subjects in frame.

Writes research/photo-focus-candidates.json: { "/assets/photos/.../x.webp": "X% Y%" } for photos whose focus looks off-centre.
Detection is rough (textures and carvings pass as faces), so look at each candidate and copy the good ones into
content/photo-focus.json, which tools/build.mjs turns into object-position on every <img> (/sm/ copies share the entry).
Using the focus point itself as object-position keeps it visible at the same relative spot in any box shape.

- faces (frontal and profile, people and statues) win
- portrait and square photos without a face: the top of the subject (first row with detail below the sky)
- anything else stays centred
Run: python tools/photo_focus.py
"""
import json
import pathlib

import cv2
import numpy as np

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "research" / "photo-focus-candidates.json"
CHECKED = ROOT / "content" / "photo-focus.json"
CASCADES = [cv2.CascadeClassifier(cv2.data.haarcascades + c) for c in ("haarcascade_frontalface_default.xml", "haarcascade_profileface.xml")]


def faces(gray):
    h, w = gray.shape
    found = []
    for i, cc in enumerate(CASCADES):
        for flip in (False, True) if i else (False,):
            g = cv2.flip(gray, 1) if flip else gray
            for x, y, fw, fh in cc.detectMultiScale(g, 1.1, 7, minSize=(max(24, w // 30),) * 2):
                found.append((w - x - fw if flip else x, y, fw, fh))
    return found


def subject_top(gray):
    """First row (0..1) where detail starts, scanning down from the top; 0 when the subject touches the top edge."""
    gy = np.abs(cv2.Sobel(cv2.GaussianBlur(gray, (5, 5), 0), cv2.CV_32F, 0, 1)) + np.abs(cv2.Sobel(cv2.GaussianBlur(gray, (5, 5), 0), cv2.CV_32F, 1, 0))
    rows = cv2.blur(gy.mean(axis=1).reshape(-1, 1), (1, 9)).ravel()
    hit = np.nonzero(rows > 0.35 * rows.mean())[0]
    return hit[0] / len(rows) if len(hit) else 0.0


def focus(path):
    im = cv2.imread(str(path))
    if im is None:
        return None
    h, w = im.shape[:2]
    s = 640 / max(h, w)
    gray = cv2.equalizeHist(cv2.cvtColor(cv2.resize(im, None, fx=s, fy=s, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY))
    gh, gw = gray.shape
    fs = faces(gray)
    if fs:
        # the largest face and any face at least half its size
        big = max(f[2] for f in fs)
        fs = [f for f in fs if f[2] >= big / 2]
        fx = sum(x + fw / 2 for x, y, fw, fh in fs) / len(fs) / gw
        fy = sum(y + fh / 2 for x, y, fw, fh in fs) / len(fs) / gh
        if abs(fx - 0.5) > 0.12 or abs(fy - 0.5) > 0.12:
            return round(fx * 100), round(fy * 100), "face"
        return None
    if w / h < 1.25:
        top = subject_top(gray)
        fy = min(0.5, top + 0.08)
        if fy < 0.38:
            return 50, round(fy * 100), "top"
    return None


def main():
    checked = json.loads(CHECKED.read_text(encoding="utf8")) if CHECKED.exists() else {}
    auto, kinds = {}, {"face": 0, "top": 0}
    for p in sorted((ROOT / "assets" / "photos").rglob("*.webp")):
        if "sm" in p.parts:
            continue
        key = "/" + p.relative_to(ROOT).as_posix()
        r = None if key in checked else focus(p)
        if r:
            auto[key] = f"{r[0]}% {r[1]}%"
            kinds[r[2]] += 1
    OUT.write_text(json.dumps(dict(sorted(auto.items())), indent=0), encoding="utf8")
    print(f"{len(auto)} candidates ({kinds['face']} by face, {kinds['top']} by subject top) in {OUT.relative_to(ROOT)}; {len(checked) - 1} already checked")


if __name__ == "__main__":
    main()
