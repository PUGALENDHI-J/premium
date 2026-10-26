"""Fetch freely licensed topic photos (money, water, trekking, ...) for destination cards from Wikimedia Commons.

Usage: python tools/fetch_topic_photos.py
Reads content/photo-topics.json (key -> Commons search), writes assets/photos/t/<key>.webp and
content/photos-topics.json (author, licence and source, used for the credits page). Uses the same licence
checks as tools/fetch_photos.py. Keys whose search is unchanged are skipped, so the script can be re-run.
Keys listed under "_large" are full-width hero photos: only originals at least MIN_LARGE pixels wide are
accepted and they are saved up to LARGE wide, so they stay sharp on wide screens.
"""
import io, json, sys
from pathlib import Path
from PIL import Image
from fetch_photos import BAD, commons_files, get, licensed

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "photos" / "t"
TOPICS = ROOT / "content" / "photo-topics.json"
CREDITS = ROOT / "content" / "photos-topics.json"
LARGE, MIN_LARGE = 2200, 1800


def save(raw, key, large=False):
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    wide = 2.6 if large else 1.6  # crop very wide shots towards the frame they are shown in
    if w / h > wide:
        nw = int(h * wide)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    if large and im.width < MIN_LARGE:
        return None  # too small to stay sharp full-width; try the next file
    im.thumbnail((LARGE, LARGE) if large else (720, 720), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{key}.webp", "WEBP", quality=72 if large else 74, method=6)
    return f"/assets/photos/t/{key}.webp"


def main():
    raw = json.loads(TOPICS.read_text(encoding="utf8"))
    skip = set(raw.get("_skip", []))
    large = set(raw.get("_large", []))
    small_now = lambda k: (OUT / f"{k}.webp").exists() and Image.open(OUT / f"{k}.webp").width < MIN_LARGE
    credits = json.loads(CREDITS.read_text(encoding="utf8")) if CREDITS.exists() else {}
    used = {c["file"] for c in credits.values()}
    for key, q in raw.items():
        if key.startswith("_") or (key in credits and credits[key].get("q") == q and credits[key]["file"] not in skip and not (key in large and small_now(key))):
            continue
        res = None
        try:
            for _, name in commons_files(q):
                if BAD.search(name) or (name in used and name != credits.get(key, {}).get("file")) or name in skip:
                    continue
                info = licensed(name, 2560 if key in large else 1280, landscape=True)
                if info:
                    img = save(get(info.pop("thumb")), key, key in large)
                    if not img:
                        continue
                    res = {**info, "img": img, "q": q}
                    break
        except Exception as e:
            print("  !", key, q, e, file=sys.stderr)
        if res:
            if key in credits and credits[key]["file"] != res["file"]:
                used.discard(credits[key]["file"])
            credits[key] = res
            used.add(res["file"])
        print(key, "->", res["file"] if res else "NO PHOTO", flush=True)
        CREDITS.write_text(json.dumps(credits, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")


if __name__ == "__main__":
    main()
