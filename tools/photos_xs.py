"""Write a small copy of every site photo for icons and cards, so the browser decodes far fewer pixels while scrolling.

Usage: python tools/photos_xs.py
Each <dir>/<key>.webp gets <dir>/xs/<key>.webp, 600 px wide (smaller sources keep their size).
tools/build.mjs lists the xs, sm and full copies in a srcset with sizes="auto", so each <img> loads the smallest copy
that covers its box. Re-run after adding or replacing photos; copies newer than their source are skipped.
"""
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIRS = ["assets/photos", "assets/photos/a", "assets/photos/vw", "assets/photos/t", "assets/photos/own", "assets/exp"]
XS = 600


def one(src):
    out = src.parent / "xs" / src.name
    if out.exists() and out.stat().st_mtime >= src.stat().st_mtime:
        return 0
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > XS:
            im = im.resize((XS, round(im.height * XS / im.width)), Image.LANCZOS)
        out.parent.mkdir(exist_ok=True)
        im.save(out, "WEBP", quality=78, method=6)
    return 1


if __name__ == "__main__":
    files = [f for d in DIRS for f in sorted((ROOT / d).glob("*.webp"))]
    with ThreadPoolExecutor(8) as ex:
        n = sum(ex.map(one, files))
    print(f"{n} written, {len(files) - n} up to date")
