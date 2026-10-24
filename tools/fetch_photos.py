"""Fetch freely licensed destination photos from Wikipedia / Wikimedia Commons.

Usage: node tools/photo-targets.mjs && python tools/fetch_photos.py
Reads research/photo-targets.json, writes assets/photos/<key>.webp (large), assets/photos/sm/<key>.webp
(cards) and content/photos.json (author, licence and source for every photo, used for the credits page).
Only Commons files under CC0, public domain, CC BY or CC BY-SA are accepted. Already-fetched keys are skipped,
so the script can be re-run to fill gaps.
"""
import io, json, re, sys, time, urllib.parse, urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "photos"
CREDITS = ROOT / "content" / "photos.json"
OVERRIDES = ROOT / "content" / "photo-overrides.json"
COMMONS = "https://commons.wikimedia.org/w/api.php"
UA = "NexaraHolidaysSiteBuilder/1.0 (https://nexaraholidays.com; static site photo fetcher)"
API = "https://en.wikipedia.org/w/api.php"
BAD = re.compile(r"flag|map|locator|location|seal|emblem|coat[_ ]of[_ ]arms|logo|\.svg|\.gif|\.tif|diagram|chart|icon|signature|portrait|banknote|stamp", re.I)
OK_LICENCE = re.compile(r"^(cc0|public domain|pd|cc[ -]by(-sa)?[ -]\d)", re.I)
SIZES = {"place": (1600, 640), "top": (1600, 640), "attraction": (960, None)}


def get(url, tries=4):
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as r:
                return r.read()
        except Exception as e:  # rate limits and timeouts: back off and retry
            if i == tries - 1:
                raise
            time.sleep(3 * (i + 1))


def api(base=API, **params):
    params.update(format="json", formatversion="2")
    return json.loads(get(base + "?" + urllib.parse.urlencode(params)))


def strip(html):
    t = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", "", html or "")).strip()
    m = re.fullmatch(r"(.+?)\s*", t)  # some Artist fields repeat the name
    return m.group(1) if m else t


def candidates(query):
    """Lead images of the top search results for a query."""
    d = api(action="query", generator="search", gsrsearch=query, gsrlimit=3, prop="pageimages", piprop="name")
    pages = sorted(d.get("query", {}).get("pages", []), key=lambda p: p.get("index", 99))
    return [(p["title"], p["pageimage"]) for p in pages if p.get("pageimage")]


def commons_files(query):
    """Files matching a search on Wikimedia Commons itself (used for hand-picked overrides)."""
    d = api(COMMONS, action="query", list="search", srnamespace=6, srsearch=query + " filetype:bitmap", srlimit=12)
    return [(query, h["title"].split(":", 1)[1]) for h in d.get("query", {}).get("search", [])]


def licensed(file_name, width, landscape=False):
    d = api(action="query", titles="File:" + file_name, prop="imageinfo", iiprop="extmetadata|url|size", iiurlwidth=width)
    page = d["query"]["pages"][0]
    if page.get("imagerepository") != "shared" or not page.get("imageinfo"):
        return None  # local enwiki files are often non-free
    ii = page["imageinfo"][0]
    meta = {k: v.get("value", "") for k, v in ii.get("extmetadata", {}).items()}
    lic = strip(meta.get("LicenseShortName", ""))
    if "NonFree" in meta or not OK_LICENCE.match(lic) or ii.get("width", 0) < 900:
        return None
    if landscape and ii.get("height", 1) * 1.15 > ii.get("width", 0):
        return None
    return {
        "thumb": ii.get("thumburl") or ii["url"],
        "file": file_name,
        "author": strip(meta.get("Artist", "")) or "Unknown author",
        "license": lic,
        "licenseUrl": strip(meta.get("LicenseUrl", "")),
        "source": ii.get("descriptionurl", ""),
    }


def save(raw, key, kind):
    big, small = SIZES[kind]
    im = Image.open(io.BytesIO(raw)).convert("RGB")
    sub = "a/" if kind == "attraction" else ""
    for w, folder in ((big, OUT / sub), (small, OUT / "sm") if small else (None, None)):
        if not w:
            continue
        folder.mkdir(parents=True, exist_ok=True)
        copy = im.copy()
        copy.thumbnail((w, w * 2), Image.LANCZOS)
        copy.save(folder / f"{key}.webp", "WEBP", quality=72, method=6)
    return f"/assets/photos/{sub}{key}.webp"


def fetch(t, used):
    pick = t.get("override")
    for q in ([pick] if pick else t["q"]):
        try:
            for title, name in (commons_files(q) if pick else candidates(q)):
                if BAD.search(name) or name in used:
                    continue
                info = licensed(name, 1920 if t["kind"] != "attraction" else 1280, landscape=bool(pick))
                if not info:
                    continue
                used.add(name)
                path = save(get(info.pop("thumb")), t["key"], t["kind"])
                return {**info, "page": title, "img": path, **({"q": pick} if pick else {})}
        except Exception as e:
            print("  !", t["key"], q, e, file=sys.stderr)
    return None


def main():
    targets = json.loads((ROOT / "research" / "photo-targets.json").read_text(encoding="utf8"))
    credits = json.loads(CREDITS.read_text(encoding="utf8")) if CREDITS.exists() else {}
    raw = json.loads(OVERRIDES.read_text(encoding="utf8")) if OVERRIDES.exists() else {}
    over = {k: v for k, v in raw.items() if not k.startswith("_")}
    # photos rejected on review: drop them and never fetch them again
    skip = set(raw.get("_skip", []))
    for k in skip & set(credits):
        (ROOT / credits[k]["img"].lstrip("/")).unlink(missing_ok=True)
        del credits[k]
    targets = [t for t in targets if t["key"] not in skip]
    for t in targets:
        if t["key"] in over:
            t["override"] = over[t["key"]]
    # fetch keys with no photo yet, and keys whose override search changed
    todo = [t for t in targets if t["key"] not in credits or (t.get("override") and credits[t["key"]].get("q") != t["override"])]
    used = {c["file"] for k, c in credits.items() if k not in {t["key"] for t in todo}}
    print(f"{len(todo)} of {len(targets)} still to fetch")
    done = 0

    def work(t):
        return t, fetch(t, used)

    with ThreadPoolExecutor(max_workers=4) as pool:
        for t, res in pool.map(work, todo):
            done += 1
            if res:
                credits[t["key"]] = res
            if done % 25 == 0 or done == len(todo):
                CREDITS.write_text(json.dumps(credits, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")
                print(f"{done}/{len(todo)}  photos: {len(credits)}", flush=True)
    CREDITS.write_text(json.dumps(credits, indent=0, ensure_ascii=False, sort_keys=True), encoding="utf8")
    missing = [t["key"] for t in targets if t["key"] not in credits]
    print(f"done: {len(credits)} photos, {len(missing)} without a licensed photo")


if __name__ == "__main__":
    main()
