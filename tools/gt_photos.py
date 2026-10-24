"""Match the GT Holidays image library (assets/gtholidays, owner-licensed) to Nexara destinations and attractions.

Usage: node tools/place-list.mjs && python tools/gt_photos.py && npm run build
Writes assets/photos/gt/<key>.webp (large), assets/photos/gt/sm/<key>.webp (cards) and content/photos-gt.json.
Skipped on purpose: staff/customer photos (about-us, testimonials), logos, maps, icons, call-to-action strips,
and graphics (very wide banners, transparent PNGs, collages on flat white/black backgrounds).
"""
import json, re
from collections import defaultdict
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
GT = ROOT / "assets" / "gtholidays"
OUT = ROOT / "assets" / "photos" / "gt"
# only package, destination and home pages: blog images carry headline text, about-us/testimonials show people
ALLOW_PAGE = {"", "packages", "package", "honeymoon-packages", "category", "destination-wedding"}
TEXT_ART = re.compile(r"honeymoon packages? (from )?chenn|chennai to |cordelia|things you|why choose", re.I)
REJECT = {"lumbini", "zanzibar", "uttar-pradesh", "darjeeling--darjeeling-himalayan-railway"}  # wrong place on review
SKIP_NAME = re.compile(r"\b(logo|map|cta|icon|background|award|atms?|credit cards?|bank|drinking|safest|whatsapp|certificate|team|director|founder|ceo|manager|staff|office|branch|review|banner|infographic|itinerary)\b", re.I)
STOP = {"the", "and", "of", "at", "in", "a", "to", "with", "on", "for", "by", "gt", "holidays", "tour", "tours", "package", "packages", "travel", "trip", "holiday", "best", "top", "visit", "view", "famous", "near"}
GENERIC = {"temple", "fort", "palace", "beach", "lake", "national", "park", "falls", "waterfall", "museum", "church", "hill", "hills", "island", "islands", "garden", "gardens", "valley", "river", "city", "old", "town", "market", "view", "point", "cave", "caves", "dam", "bridge", "tower", "square", "street", "village", "safari", "cruise", "ride", "walk", "trek", "statue", "mosque", "monastery"}
ALIAS = {"pondicherry": "puducherry", "bangalore": "bengaluru", "mysore": "mysuru", "vizag": "visakhapatnam", "leh-ladakh": "ladakh", "leh": "leh",
         "swiss": "switzerland", "denmark-republic": "denmark", "finland-republic": "finland", "vrindavan": "mathura-vrindavan", "haridwar-and-rishikesh": "rishikesh",
         "ooty": "ooty", "alleppey": "alleppey", "trivandrum": "thiruvananthapuram", "cochin": "kochi", "calcutta": "kolkata", "delhi": "delhi", "uk": "united-kingdom", "dubai": "dubai"}


def words(s):
    s = re.sub(r"\(.*?\)", " ", s.lower())
    return [w for w in re.findall(r"[a-z0-9]+", s.replace("'", "")) if w not in STOP]


def page_slug(url):
    leaf = url.replace("https://www.gtholidays.in/", "").strip("/").split("/")[-1]
    return re.sub(r"-(tour|honeymoon|holiday|travel|trip|edu|group|family)?-?packages?$|-tour$|-package-by-gt-holidays$", "", leaf)


def is_photo(path):
    """True for real photographs: not too wide/tall, no transparency, not mostly flat white/black."""
    try:
        im = Image.open(path)
        w, h = im.size
        if w < 640 or h < 340 or not (0.95 <= w / h <= 2.1):
            return None
        if im.mode in ("RGBA", "LA", "P") and ("transparency" in im.info or im.mode != "P"):
            return None
        small = im.convert("L").resize((64, 64))
        px = list(small.getdata())
        flat = sum(1 for p in px if p > 245 or p < 10) / len(px)
        return None if flat > 0.22 else (w, h)
    except Exception:
        return None


def main():
    places = json.loads((ROOT / "research" / "place-list.json").read_text(encoding="utf8"))
    keys = {p["key"]: p for p in places}
    names = sorted(((words(p["name"]), p["key"]) for p in places), key=lambda x: -len(" ".join(x[0])))
    items = json.loads((GT / "products.json").read_text(encoding="utf8"))

    # 1. usable photos, each tied to the Nexara places it shows
    photos = []
    for it in items:
        url = it["fields"]["page_url"].replace("https://www.gtholidays.in/", "")
        if url.split("/")[0] not in ALLOW_PAGE or SKIP_NAME.search(it["name"] or "") or TEXT_ART.search(it["name"] or ""):
            continue
        size = is_photo(GT / it["image"])
        if not size:
            continue
        slug = page_slug(it["fields"]["page_url"])
        slug = ALIAS.get(slug, slug)
        tw = set(words(it["name"]))
        where = set()
        if slug in keys:
            where.add(slug)
        for nw, k in names:  # place names mentioned in the photo's own name
            if nw and set(nw) <= tw:
                where.add(k)
        if where:
            photos.append({"file": GT / it["image"], "name": it["name"], "w": words(it["name"]), "size": size, "where": where})
    print(len(photos), "usable photos tied to a place")

    by_place = defaultdict(list)
    for ph in photos:
        for k in ph["where"]:
            by_place[k].append(ph)

    def landscape(ph):
        w, h = ph["size"]
        return 1.25 <= w / h <= 2.1

    chosen, used = {}, set()
    # 2. attractions: the photo's name must contain the attraction's distinctive words
    for p in places:
        pool = by_place.get(p["key"], []) + by_place.get(p["parent"], [])
        for a in p["attractions"]:
            aw = set(words(a["name"]))
            key_words = {w for w in aw if w not in GENERIC and len(w) > 2}
            if not key_words:
                continue
            best, score = None, 0
            for ph in pool:
                if ph["file"] in used:
                    continue
                tw = set(ph["w"])
                s = len(aw & tw) / len(aw)
                if key_words <= tw or (s >= 0.6 and key_words & tw):
                    s += 1 + (0.3 if landscape(ph) else 0)
                    if s > score:
                        best, score = ph, s
            if best and a["key"] not in REJECT:
                chosen[a["key"]] = best
                used.add(best["file"])
    # 3. destination photo: a landscape photo from the place's own GT page, preferring ones naming the place
    for p in places:
        pool = [ph for ph in by_place.get(p["key"], []) if ph["file"] not in used] or by_place.get(p["key"], [])
        if not pool or p["key"] in REJECT:
            continue
        pw = set(words(p["name"]))
        pool.sort(key=lambda ph: (landscape(ph), bool(pw & set(ph["w"])), ph["size"][0]), reverse=True)
        chosen[p["key"]] = pool[0]
        used.add(pool[0]["file"])

    # 4. write webp copies and the index
    (OUT / "sm").mkdir(parents=True, exist_ok=True)
    index = {}
    for key, ph in chosen.items():
        im = Image.open(ph["file"]).convert("RGB")
        big = im.copy(); big.thumbnail((1600, 1600), Image.LANCZOS); big.save(OUT / f"{key}.webp", "WEBP", quality=80, method=6)
        if "--" not in key:
            sm = im.copy(); sm.thumbnail((720, 720), Image.LANCZOS); sm.save(OUT / "sm" / f"{key}.webp", "WEBP", quality=76, method=6)
        index[key] = {"img": f"/assets/photos/gt/{key}.webp", "source": "GT Holidays", "gtName": ph["name"]}
    (ROOT / "content" / "photos-gt.json").write_text(json.dumps(index, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")
    dest = [k for k in index if "--" not in k]
    print(f"{len(index)} photos matched: {len(dest)} destinations, {len(index) - len(dest)} attractions")
    print("destinations without a GT photo:", " ".join(sorted(k for k in keys if k not in index)))


if __name__ == "__main__":
    main()
