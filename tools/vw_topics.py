"""Replace experience-page photos (content/photos-topics.json) that centre on people with Veena World place photos.

Usage: python tools/vw_topics.py && npm run build
Each entry below names a topic key and the Veena World source photo (by its name in products.csv). The photo is
written to assets/photos/t/<key>.webp with the same sizes and crop as tools/fetch_topic_photos.py, and its index
entry keeps the key's search phrase in "q", so fetch_topic_photos.py leaves it alone on later runs.
"""
import csv, json
from pathlib import Path

import pillow_avif  # noqa: F401  (registers the AVIF decoder with Pillow)
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
VW = ROOT / "assets" / "veenaworld"
OUT = ROOT / "assets" / "photos" / "t"
TOPICS = ROOT / "content" / "photo-topics.json"
CREDITS = ROOT / "content" / "photos-topics.json"
LARGE = 2200  # same as fetch_topic_photos.py

PICK = {
    # Roots & Heritage header: the couple in a night procession -> Brihadeeswarar Temple, Thanjavur
    "x-her-festival": "Best Places to Visit in Thanjavur - A Travel Guide",
    # heritage food card: a grandmother cooking -> Kerala sadya on a banana leaf
    "x-her-food": "Think You Know All About Kerala Cuisine?",
    # Educational Trips header: two students walking -> the Louvre
    "x-edu-campus": "Everything You Need to Know about the Louvre Museum",
    # field trips card: a school group on rocks -> Jantar Mantar observatory, Jaipur
    "x-edu-hero": "Jantar Mantar Jaipur: Timings, Ticket Price",
}


def source(name):
    """Largest image in the library whose name starts with `name`."""
    best = None
    for f in sorted(VW.glob("part*/products.csv")):
        for r in csv.DictReader(open(f, encoding="utf-8-sig", newline="")):
            full = " ".join(dict.fromkeys(x.strip() for x in (r["name"], r["original: alt_text"]) if x and x.strip()))
            if full.startswith(name) or r["name"].startswith(name):
                p = f.parent / r["image_1_file"]
                try:
                    w = Image.open(p).size[0]
                except Exception:
                    continue
                if not best or w > best[1]:
                    best = (p, w, r["name"])
    if not best:
        raise SystemExit(f"no Veena World photo named {name!r}")
    return best


def main():
    raw = json.loads(TOPICS.read_text(encoding="utf8"))
    large = set(raw.get("_large", []))
    credits = json.loads(CREDITS.read_text(encoding="utf8"))
    for key, name in PICK.items():
        path, w, full = source(name)
        im = Image.open(path).convert("RGB")
        wide = 2.6 if key in large else 1.6
        if im.width / im.height > wide:
            nw = int(im.height * wide)
            im = im.crop(((im.width - nw) // 2, 0, (im.width - nw) // 2 + nw, im.height))
        im.thumbnail((LARGE, LARGE) if key in large else (720, 720), Image.LANCZOS)
        im.save(OUT / f"{key}.webp", "WEBP", quality=72 if key in large else 74, method=6)
        credits[key] = {"img": f"/assets/photos/t/{key}.webp", "source": "Veena World", "file": path.name, "vwName": full, "q": raw[key]}
        print(f"{key}: {full} ({w}px -> {im.width}px)")
    CREDITS.write_text(json.dumps(credits, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")


if __name__ == "__main__":
    main()
