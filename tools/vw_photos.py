"""Match the Veena World image library (assets/veenaworld, used with the owner's written permission) to Nexara
destinations and attractions. Replaces the GT Holidays library.

Usage: node tools/place-list.mjs && python tools/vw_photos.py && npm run build
Source: the zips in "assets/main images", extracted to assets/veenaworld/part1 ... part11 (each has products.csv).
Writes assets/photos/vw/<key>.webp (large), assets/photos/vw/sm/<key>.webp (cards), content/photos-vw.json,
and research/vw-unmatched.json (usable photos that name no Nexara place, to spot destinations worth adding).

Only real place photographs are used. Skipped on purpose:
- guest and staff photos: feedback galleries, tour managers, "our people", about-us, testimonials
- Veena World banners: search/og images and package banners carry the Veena World logo
- thumbnails under 960 x 540 (tour cards are 300 px wide)
- hotels, resorts, restaurants, food, festivals and people shots, by name or page
- any photo with a prominent face (OpenCV face detector), so family and group pictures never appear
A photo is tied to a place only when its own name names that place (or the attraction, on that place's page).
"""
import csv, hashlib, json, re, sys
from collections import Counter, defaultdict
from pathlib import Path

import cv2
import numpy as np
import pillow_avif  # noqa: F401  (registers the AVIF decoder with Pillow)
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
VW = ROOT / "assets" / "veenaworld"
OUT = ROOT / "assets" / "photos" / "vw"

SKIP_URL = re.compile(r"/gallery/|og-images|search-results|gift-card|/about-us|our-people|ytimg|/icons?/|/logo|/misc/|/(customized-holidays|group-tours)/", re.I)
SKIP_PAGE = re.compile(r"veenaworld\.com/(tour-manager|our-people|careers|gift-card|contact-us|reviews-and-testimonials|csr-policy|become-our-sales-partner|how-to-book|travel-games|video-blogs|flights|foreign-exchange|visa|travel-planner|travel-deals|package)(/|$)"
                       r"|/(hotels?|resorts?|restaurants?|cafes?|food|cuisine|dishes|street-food|shopping|stay|homestays?|villas?)(-|/|$)|-(hotels|resorts|restaurants|cafes|food|homestays|villas)(-|/|$)", re.I)
SKIP_NAME = re.compile(r"\b(feedback|review|testimonial|guest|manager|team|founder|director|staff|logo|icon|map|award|gift|offer|deal|sale|banner|cta|whatsapp|app|"
                       r"hotels?|resorts?|restaurants?|cafes?|food|foods|dish|dishes|cuisine|thali|biryani|curry|dessert|sweets?|snacks?|drinks?|cocktails?|wine|beer|coffee|tea cup|breakfast|lunch|dinner|buffet|"
                       r"stay|homestay|villa|suite|room|rooms|spa|pool|lobby|bedroom|"
                       r"family|families|kids?|children|child|friends|couples?|honeymooners?|selfie|people|woman|women|man|men|girl|boy|lady|ladies|traveller|travellers|tourists?|portrait|locals|tribes?|tribal|sadhu|monk|"
                       r"festival|festivals|celebration|dance|dancers?|garba|parade|wedding|bride|groom|carnival|"
                       r"visa|passport|flight|airport|airline|forex|currency|insurance|luggage|suitcase|packing|checklist|"
                       r"infographic|itinerary|calendar|collage|quiz)\b", re.I)
STOP = {"the", "and", "of", "at", "in", "a", "an", "to", "with", "on", "for", "by", "from", "veena", "world", "tour", "tours", "package", "packages", "travel", "trip", "trips",
        "holiday", "holidays", "best", "top", "visit", "visiting", "view", "views", "famous", "near", "places", "place", "things", "do", "see", "guide", "complete", "must", "your",
        "you", "is", "are", "how", "what", "why", "when", "where", "this", "that", "it", "its", "time", "day", "days", "night", "nights", "first", "timers", "explore", "exploring",
        "beautiful", "popular", "amazing", "most", "iconic", "attractions", "attraction", "tourist", "sightseeing", "experience", "experiences", "india", "indian", "jpg", "img"}
GENERIC = {"temple", "temples", "fort", "palace", "beach", "beaches", "lake", "national", "park", "falls", "waterfall", "waterfalls", "museum", "church", "hill", "hills", "island",
           "islands", "garden", "gardens", "valley", "river", "city", "old", "town", "market", "point", "cave", "caves", "dam", "bridge", "tower", "square", "street", "village",
           "safari", "cruise", "ride", "walk", "trek", "statue", "mosque", "monastery", "sanctuary", "wildlife", "reserve", "sri", "shri", "great", "new", "north", "south", "east", "west"}
STRUCT = {"temple", "fort", "palace", "beach", "lake", "museum", "church", "falls", "waterfall", "cave", "caves", "dam", "bridge", "tower", "castle", "mosque", "monastery",
          "garden", "gardens", "zoo", "market", "square", "stupa", "pagoda", "cathedral", "basilica", "dargah", "ghat", "island", "peak", "point", "ground", "sanctuary", "railway"}
# words that are also everyday English or names: a photo must name the place with another word of it
AMBIGUOUS = {"nice", "jordan", "georgia", "victoria", "male", "puri", "chandigarh-city", "split", "bath", "reading", "orange", "china", "turkey", "como", "mahe", "diu", "goa-velha"}
ALIAS = {"pondicherry": "puducherry", "bangalore": "bengaluru", "mysore": "mysuru", "vizag": "visakhapatnam", "trivandrum": "thiruvananthapuram", "cochin": "kochi",
         "calcutta": "kolkata", "bombay": "mumbai", "madras": "chennai", "coorg": "coorg", "alleppey": "alleppey", "alappuzha": "alleppey", "ooty": "ooty", "udhagamandalam": "ooty",
         "vrindavan": "mathura-vrindavan", "mathura": "mathura-vrindavan", "havelock": "havelock", "swaraj": "havelock", "neil": "neil-island", "uae": "uae", "dubai": "dubai",
         "uk": "united-kingdom", "england": "united-kingdom", "usa": "usa", "america": "usa", "srinagar": "srinagar", "kashmir": "jammu-and-kashmir", "andaman": "andaman-and-nicobar",
         "andamans": "andaman-and-nicobar", "varkala": "varkala", "kovalam": "kovalam", "benaras": "varanasi", "banaras": "varanasi", "kashi": "varanasi", "gurugram": "gurugram",
         "mcleodganj": "dharamshala", "bijapur": "vijayapura", "ranakpur": "kumbhalgarh", "shekhawati": "mandawa", "tungnath": "chopta", "chandrashila": "chopta", "makaibari": "kurseong", "gumbaz": "vijayapura"}
REJECT = set()  # place or attraction keys that must never get a Veena World photo
# photos rejected on visual review (wrong place, people, food, too dark): research/vw-rejected.json, by source name;
# the place then gets its next-best photo, or keeps its Commons one
REJECTED = ROOT / "research" / "vw-rejected.json"
CACHE = ROOT / "research" / "vw-check-cache.json"  # check_photo results, so re-runs skip decoding the large originals


def words(s):
    s = re.sub(r"\(.*?\)", " ", (s or "").lower()).replace("'", "").replace("’", "")
    return [w for w in re.findall(r"[a-z0-9]+", s) if w not in STOP]


def page_words(url):
    path = re.sub(r"^https?://www\.veenaworld\.com/?", "", url or "").split("?")[0]
    return words(path.replace("/", " ").replace("-", " "))


FACES = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def check_photo(path):
    """(w, h, sharpness) for a usable landscape photograph, else None."""
    try:
        im = Image.open(path)
        w, h = im.size
        if w < 960 or h < 540 or not (1.0 <= w / h <= 2.2):
            return None
        g = np.asarray(im.convert("L").resize((640, int(640 * h / w))))
        flat = float(((g > 245) | (g < 10)).mean())
        if flat > 0.22:  # graphics, collages on white or black
            return None
        faces = FACES.detectMultiScale(g, scaleFactor=1.1, minNeighbors=7, minSize=(int(640 * 0.045),) * 2)
        if len(faces):
            return None
        return (w, h, float(cv2.Laplacian(g, cv2.CV_64F).var()))
    except Exception:
        return None


def main():
    places = json.loads((ROOT / "research" / "place-list.json").read_text(encoding="utf8"))
    keys = {p["key"]: p for p in places}
    names = []  # (name words, key), longest first so "new delhi" wins over "delhi"
    for p in places:
        nw = words(p["name"])
        if nw:
            names.append((nw, p["key"]))
    for a, k in ALIAS.items():
        if k in keys:
            names.append(([a], k))
    names.sort(key=lambda x: -len(" ".join(x[0])))

    # 1. candidate rows: one per distinct source image, with everything known about it
    rejected = set(json.loads(REJECTED.read_text(encoding="utf8"))) if REJECTED.exists() else set()
    cache = json.loads(CACHE.read_text(encoding="utf8")) if CACHE.exists() else {}
    rows, seen = [], set()
    for csvf in sorted(VW.glob("part*/products.csv")):
        for r in csv.DictReader(open(csvf, encoding="utf-8-sig", newline="")):
            src = r["original: image_url"].split("?")[0]
            if src in seen:
                continue
            seen.add(src)
            name = " ".join(dict.fromkeys(x.strip() for x in (r["name"], r["original: alt_text"]) if x and x.strip()))
            page = r["original: page_url"]
            if name[:120] in rejected or SKIP_URL.search(src) or SKIP_PAGE.search(page) or SKIP_NAME.search(name) or SKIP_NAME.search(r["original: page_title"] or "") and not words(name):
                continue
            rows.append({"file": csvf.parent / r["image_1_file"], "name": name, "page": page, "w": words(name), "pw": page_words(page) + words(r["original: page_title"])})
    print(len(rows), "candidate rows after name/page filters")

    # 2. tie each photo to the places its own name mentions; the page only adds context for attractions
    def mentions(ws):
        found, ws = set(), set(ws)
        for nw, k in names:
            if set(nw) <= ws and not (len(nw) == 1 and nw[0] in AMBIGUOUS):
                found.add(k)
        return found

    photos, unmatched, hashes = [], Counter(), set()
    for i, r in enumerate(rows):
        where, ctx = mentions(r["w"]), mentions(r["pw"])
        if not where:
            unmatched[r["name"]] += 1
        if not where and not ctx:
            continue
        ck = str(r["file"].relative_to(VW))
        if ck not in cache:
            cache[ck] = check_photo(r["file"])
        size = cache[ck]
        if not size:
            continue
        hsh = hashlib.md5(r["file"].read_bytes()).hexdigest()
        if hsh in hashes:
            continue
        hashes.add(hsh)
        r.update(size=size, where=where, ctx=ctx)
        photos.append(r)
        if i % 500 == 0:
            print(f"  checked {i}/{len(rows)}", flush=True)
    CACHE.write_text(json.dumps(cache), encoding="utf8")
    print(len(photos), "usable photographs tied to a place by name or page")

    by_place, by_ctx = defaultdict(list), defaultdict(list)
    for ph in photos:
        for k in ph["where"]:
            by_place[k].append(ph)
        for k in ph["ctx"] | ph["where"]:
            by_ctx[k].append(ph)

    def quality(ph):
        w, h, sharp = ph["size"]
        return (1.3 <= w / h <= 2.0, min(w, 2400), min(sharp, 400))

    chosen, used = {}, set()
    # 3. attractions: the photo's name carries the attraction's distinctive words, and the photo names the place or sits on its page
    for p in places:
        pool = by_ctx.get(p["key"], []) + [ph for ph in by_place.get(p["parent"], []) if p["key"] in ph["ctx"]]
        for a in p["attractions"]:
            if a["key"] in REJECT:
                continue
            aw = set(words(a["name"]))
            key_words = {w for w in aw if w not in GENERIC and len(w) > 2}
            # a museum, fort, palace, lake ... must be named as one: "Kanha Museum" is not any photo of Kanha
            kind = aw & STRUCT
            # "Old Phuket Town": when the only distinctive word is the place's own name, the photo must carry the whole name
            whole = key_words <= set(words(p["name"]))
            if not key_words:
                continue
            best, score = None, None
            for ph in pool:
                if ph["file"] in used:
                    continue
                tw = set(ph["w"])
                if not kind <= tw or (whole and not aw <= tw) or not (key_words <= tw or (len(aw & tw) / len(aw) >= 0.6 and key_words & tw)):
                    continue
                s = (len(aw & tw) / len(aw), *quality(ph))
                if score is None or s > score:
                    best, score = ph, s
            if best:
                chosen[a["key"]] = best
                used.add(best["file"])
    # 4. destination photo: the best photo whose own name names the place (never only its page)
    for p in places:
        if p["key"] in REJECT:
            continue
        pool = [ph for ph in by_place.get(p["key"], []) if ph["file"] not in used]
        # a photo that names several places shows none of them well: prefer the ones naming only this place
        pool.sort(key=lambda ph: (len(ph["where"]) == 1, *quality(ph)), reverse=True)
        if pool:
            chosen[p["key"]] = pool[0]
            used.add(pool[0]["file"])

    # 5. write webp copies and the index; stale files from an earlier run are removed
    (OUT / "sm").mkdir(parents=True, exist_ok=True)
    keep = set()
    index = {}
    prev = json.loads((ROOT / "content" / "photos-vw.json").read_text(encoding="utf8")) if (ROOT / "content" / "photos-vw.json").exists() else {}
    for key, ph in sorted(chosen.items()):
        same = prev.get(key, {}).get("vwName") == ph["name"][:120] and (OUT / f"{key}.webp").exists() and ("--" in key or (OUT / "sm" / f"{key}.webp").exists())
        keep.add(f"{key}.webp")
        index[key] = {"img": f"/assets/photos/vw/{key}.webp", "source": "Veena World", "vwName": ph["name"][:120], "page": ph["page"]}
        if same:  # unchanged since the last run: keep the existing copies
            continue
        im = Image.open(ph["file"]).convert("RGB")
        big = im.copy(); big.thumbnail((1600, 1600), Image.LANCZOS); big.save(OUT / f"{key}.webp", "WEBP", quality=80, method=6)
        if "--" not in key:
            sm = im.copy(); sm.thumbnail((720, 720), Image.LANCZOS); sm.save(OUT / "sm" / f"{key}.webp", "WEBP", quality=76, method=6)
    for f in list(OUT.glob("*.webp")) + list((OUT / "sm").glob("*.webp")):
        if f.name not in keep:
            f.unlink()
    (ROOT / "content" / "photos-vw.json").write_text(json.dumps(index, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")
    (ROOT / "research" / "vw-unmatched.json").write_text(json.dumps(unmatched.most_common(), indent=0, ensure_ascii=False), encoding="utf8")
    dest = [k for k in index if "--" not in k]
    print(f"{len(index)} photos matched: {len(dest)} destinations, {len(index) - len(dest)} attractions")
    print("destinations without a Veena World photo:", len([k for k in keys if k not in index]))


if __name__ == "__main__":
    sys.exit(main())
