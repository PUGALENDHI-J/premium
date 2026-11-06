"""Cap the file size of the heaviest site photos without changing their dimensions.

Usage: python tools/compress_photos.py [--dry]
Full-size photos above FULL_MAX and card-size copies (sm/) above SM_MAX are re-encoded at the highest WebP quality
(down to MIN_Q) that brings them under the cap. Files already under their cap are never touched, so the script can be
re-run after new photos are added. Run python tools/photos_xs.py and npm run build afterwards.
"""
import io, sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
FULL_MAX, SM_MAX, MIN_Q = 380_000, 200_000, 60
DIRS = ["assets/photos", "assets/hero", "assets/exp", "assets/dest"]
SKIP = ("/xs/", "/frames/", "/main images/", "/veenaworld/")


def cap(path):
    p = path.as_posix()
    if any(s in p for s in SKIP):
        return None
    limit = SM_MAX if "/sm/" in p else FULL_MAX
    size = path.stat().st_size
    if size <= limit:
        return None
    im = Image.open(path)
    im.load()
    im = im.convert("RGBA") if im.mode in ("RGBA", "LA") else im.convert("RGB")
    best = None
    lo, hi = MIN_Q, 80
    while lo <= hi:  # highest quality that fits
        q = (lo + hi) // 2
        b = io.BytesIO()
        im.save(b, "WEBP", quality=q, method=6)
        if b.tell() <= limit:
            best, lo = (q, b.getvalue()), q + 1
        else:
            hi = q - 1
    if best is None:  # even MIN_Q is over the cap: use it anyway if it is smaller
        b = io.BytesIO()
        im.save(b, "WEBP", quality=MIN_Q, method=6)
        best = (MIN_Q, b.getvalue())
    if len(best[1]) >= size * 0.95:
        return None
    if "--dry" not in sys.argv:
        path.write_bytes(best[1])
    return p, size, len(best[1]), best[0]


def main():
    files = [f for d in DIRS for f in (ROOT / d).rglob("*.webp")]
    with ThreadPoolExecutor(6) as ex:
        done = [r for r in ex.map(cap, files) if r]
    before, after = sum(r[1] for r in done), sum(r[2] for r in done)
    for p, a, b, q in sorted(done, key=lambda r: r[1] - r[2], reverse=True)[:15]:
        print(f"{a // 1024:5} KB -> {b // 1024:4} KB (q{q})  {Path(p).relative_to(ROOT).as_posix()}")
    print(f"{len(done)} photos capped: {before / 1e6:.1f} MB -> {after / 1e6:.1f} MB")


if __name__ == "__main__":
    main()
