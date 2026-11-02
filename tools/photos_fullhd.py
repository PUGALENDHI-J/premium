"""Re-encode the site's destination photos at full HD (1920 px on the long side) from their sources.

Usage: python tools/photos_fullhd.py [vw|commons|all]
- vw: Veena World photos (content/photos-vw.json) are re-encoded from the originals in assets/veenaworld
  (matched by the name and page recorded in products.csv), without changing which photo is used.
- commons: Wikimedia Commons place photos (content/photos.json, not attractions) are downloaded again at 1920 px.
Card copies in sm/ are written at 1280 px so they stay sharp on high-density screens.
A photo whose source is smaller than full HD keeps its source size; files already at full HD are skipped.
"""
import csv, io, json, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import pillow_avif  # noqa: F401  (registers the AVIF decoder with Pillow)
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
BIG, SM = 1920, 1280
UA = "NexaraHolidaysSiteBuilder/1.0 (https://nexaraholidays.com; static site photo fetcher)"


def width(p):
    try:
        with Image.open(p) as im:
            return max(im.size)
    except Exception:
        return 0


def write(im, key_path, sm_path=None, q=80):
    big = im.copy(); big.thumbnail((BIG, BIG), Image.LANCZOS); big.save(key_path, "WEBP", quality=q, method=6)
    if sm_path and sm_path.exists():
        sm = im.copy(); sm.thumbnail((SM, SM), Image.LANCZOS); sm.save(sm_path, "WEBP", quality=q - 4, method=6)


def vw():
    index = json.loads((ROOT / "content" / "photos-vw.json").read_text(encoding="utf8"))
    src = {}
    for csvf in sorted((ROOT / "assets" / "veenaworld").glob("part*/products.csv")):
        for r in csv.DictReader(open(csvf, encoding="utf-8-sig", newline="")):
            name = " ".join(dict.fromkeys(x.strip() for x in (r["name"], r["original: alt_text"]) if x and x.strip()))[:120]
            f = csvf.parent / r["image_1_file"]
            k = (name, r["original: page_url"])
            if f.exists() and (k not in src or width(f) > width(src[k])):
                src[k] = f
    done = same = missing = 0
    for key, ph in sorted(index.items()):
        out = ROOT / ph["img"].lstrip("/")
        f = src.get((ph["vwName"], ph["page"]))
        if not f:
            missing += 1; continue
        if not out.exists() or width(out) >= min(BIG, width(f)):
            same += 1; continue
        write(Image.open(f).convert("RGB"), out, out.parent / "sm" / out.name)
        done += 1
    print(f"Veena World: {done} re-encoded at full HD, {same} already as large as their source, {missing} source not found")


def api(**params):
    params.update(format="json", formatversion="2")
    req = urllib.request.Request("https://commons.wikimedia.org/w/api.php?" + urllib.parse.urlencode(params), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read())


def get(url):
    for i in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=90) as r:
                return r.read()
        except Exception:
            if i == 3:
                raise
            time.sleep(4 * (i + 1))


def commons():
    index = json.loads((ROOT / "content" / "photos.json").read_text(encoding="utf8"))
    # attraction photos show at gallery size; only place photos are upgraded
    todo = [(k, ph) for k, ph in sorted(index.items()) if "--" not in k and "/a/" not in ph.get("img", "") and ph.get("file")]

    def one(item):
        key, ph = item
        out = ROOT / ph["img"].lstrip("/")
        if not out.exists() or width(out) >= BIG:
            return 0
        try:
            ii = api(action="query", titles="File:" + ph["file"], prop="imageinfo", iiprop="url|size", iiurlwidth=BIG)["query"]["pages"][0]["imageinfo"][0]
            if max(ii["width"], ii["height"]) <= width(out):
                return 0
            write(Image.open(io.BytesIO(get(ii.get("thumburl") or ii["url"]))).convert("RGB"), out, out.parent / "sm" / out.name, q=78)
            return 1
        except Exception as e:
            print("  !", key, e, file=sys.stderr)
            return 0

    with ThreadPoolExecutor(6) as pool:
        done = sum(pool.map(one, todo))
    print(f"Commons: {done} re-downloaded at full HD, {len(todo) - done} skipped")


if __name__ == "__main__":
    what = sys.argv[1] if len(sys.argv) > 1 else "all"
    if what in ("vw", "all"):
        vw()
    if what in ("commons", "all"):
        commons()
