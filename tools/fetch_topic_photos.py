"""Fetch freely licensed topic photos (money, water, trekking, ...) for destination cards from Wikimedia Commons.

Usage: python tools/fetch_topic_photos.py
Reads content/photo-topics.json (key -> Commons search), writes assets/photos/t/<key>.webp and
content/photos-topics.json (author, licence and source, used for the credits page). Uses the same licence
checks as tools/fetch_photos.py. Keys whose search is unchanged are skipped, so the script can be re-run.
"""
import io, json, sys
from pathlib import Path
from PIL import Image
from fetch_photos import BAD, commons_files, get, licensed

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "photos" / "t"
TOPICS = ROOT / "content" / "photo-topics.json"
CREDITS = ROOT / "content" / "photos-topics.json"


def save(raw, key):
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    w, h = im.size
    if w / h > 1.6:  # crop very wide shots towards the cards' 16:10 frame
        nw = int(h * 1.6)
        im = im.crop(((w - nw) // 2, 0, (w - nw) // 2 + nw, h))
    im.thumbnail((720, 720), Image.LANCZOS)
    OUT.mkdir(parents=True, exist_ok=True)
    im.save(OUT / f"{key}.webp", "WEBP", quality=74, method=6)
    return f"/assets/photos/t/{key}.webp"


def main():
    raw = json.loads(TOPICS.read_text(encoding="utf8"))
    skip = set(raw.get("_skip", []))
    credits = json.loads(CREDITS.read_text(encoding="utf8")) if CREDITS.exists() else {}
    used = {c["file"] for c in credits.values()}
    for key, q in raw.items():
        if key.startswith("_") or (key in credits and credits[key].get("q") == q and credits[key]["file"] not in skip):
            continue
        res = None
        try:
            for _, name in commons_files(q):
                if BAD.search(name) or name in used or name in skip:
                    continue
                info = licensed(name, 1280, landscape=True)
                if info:
                    res = {**info, "img": save(get(info.pop("thumb")), key), "q": q}
                    break
        except Exception as e:
            print("  !", key, q, e, file=sys.stderr)
        if res:
            if key in credits:
                used.discard(credits[key]["file"])
            credits[key] = res
            used.add(res["file"])
        print(key, "->", res["file"] if res else "NO PHOTO", flush=True)
        CREDITS.write_text(json.dumps(credits, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")


if __name__ == "__main__":
    main()
