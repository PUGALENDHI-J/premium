"""Responsible metadata crawler for the reference site (GT Holidays).

Records page *structure* only (titles, headings, links, durations, breadcrumbs).
It never stores page prose or downloads images. Standard library only.

Usage:
  python tools/crawl_reference.py [--max-pages 2500] [--max-depth 2] [--rate 1.0] [--workers 2]

Outputs (research/):
  gt-holidays-url-inventory.csv / .json, gt-holidays-crawl-report.md (+ page-types / hierarchy via
  tools/analyse_reference.py)
"""
import argparse, csv, json, re, sys, threading, time, urllib.robotparser
from collections import Counter, deque
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urljoin, urlsplit, urlunsplit
from urllib.request import Request, urlopen

BASE = "https://www.gtholidays.in"
HOST = "www.gtholidays.in"
UA = "NexaraResearchBot/1.0 (+https://nexaraholidays.com; contact hello@nexaraholidays.com)"
OUT = Path(__file__).resolve().parent.parent / "research"
SKIP_EXT = re.compile(r"\.(jpe?g|png|gif|webp|svg|pdf|zip|mp4|mp3|css|js|ico|xml|txt|woff2?)$", re.I)


def canon(url):
    """Canonicalise: https, lower-case host, no query/fragment, trailing slash on paths."""
    p = urlsplit(url)
    if p.scheme not in ("http", "https"):
        return None
    host = p.netloc.lower()
    if host in ("gtholidays.in", "www.gtholidays.in"):
        host = HOST
    path = re.sub(r"/{2,}", "/", p.path or "/")
    if not SKIP_EXT.search(path) and not path.endswith("/"):
        path += "/"
    return urlunsplit(("https", host, path, "", ""))


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""; self.meta = {}; self.canonical = ""; self.links = []; self.images = []
        self.h1 = []; self.h2 = []; self.h3 = []; self.ld = []; self.rel = {}
        self._tag = None; self._buf = []; self._in_title = False; self._in_ld = False
        self.crumbs = []; self._crumb_depth = 0; self._depth = 0; self._crumb_buf = []

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self._depth += 1
        if tag == "title": self._in_title = True
        elif tag == "meta" and a.get("name") in ("description", "robots"):
            self.meta[a["name"]] = a.get("content", "")
        elif tag == "meta" and a.get("property") in ("og:type", "og:title"):
            self.meta[a["property"]] = a.get("content", "")
        elif tag == "link" and a.get("rel") in ("canonical", "next", "prev"):
            self.rel[a["rel"]] = a.get("href", "")
        elif tag == "a" and a.get("href"):
            self.links.append(a["href"])
        elif tag == "img":
            src = a.get("data-src") or a.get("data-lazy-src") or a.get("src") or ""
            if src and not src.startswith("data:"):
                self.images.append({"src": src, "alt": a.get("alt", "")})
        elif tag in ("h1", "h2", "h3"):
            self._tag = tag; self._buf = []
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True; self._buf = []
        cls = a.get("class", "") or ""
        if "breadcrumb" in cls.lower() and not self._crumb_depth:
            self._crumb_depth = self._depth
        if self._crumb_depth and tag in ("a", "span", "li"):
            self._crumb_buf = []

    def handle_endtag(self, tag):
        if tag == "title": self._in_title = False
        elif tag == self._tag:
            txt = re.sub(r"\s+", " ", "".join(self._buf)).strip()
            if txt: getattr(self, tag).append(txt)
            self._tag = None
        elif tag == "script" and self._in_ld:
            self.ld.append("".join(self._buf)); self._in_ld = False
        if self._crumb_depth and tag in ("a", "span", "li"):
            t = re.sub(r"\s+", " ", "".join(self._crumb_buf)).strip()
            if t and t not in ("»", "/", ">") and (not self.crumbs or self.crumbs[-1] != t):
                self.crumbs.append(t)
            self._crumb_buf = []
        if self._crumb_depth and self._depth == self._crumb_depth:
            self._crumb_depth = 0
        self._depth -= 1

    def handle_data(self, d):
        if self._in_title: self.title += d
        if self._tag or self._in_ld: self._buf.append(d)
        if self._crumb_depth: self._crumb_buf.append(d)


def page_type(path):
    segs = [s for s in path.strip("/").split("/") if s]
    if not segs: return "home"
    s0 = segs[0]
    if s0 == "package": return "package-detail"
    if s0 == "packages":
        return {1: "package-hub", 2: "package-region-hub"}.get(len(segs), "package-listing")
    if s0 in ("honeymoon-packages", "destination-wedding"): return s0.replace("-packages", "") + "-listing"
    if s0 in ("blog", "category", "tag", "author"): return "blog-archive"
    if s0 == "page" or "page" in segs: return "pagination"
    return "page"


def crumbs_from_ld(blocks):
    for raw in blocks:
        try:
            data = json.loads(raw)
        except Exception:
            continue
        stack = [data]
        while stack:
            d = stack.pop()
            if isinstance(d, list): stack.extend(d); continue
            if not isinstance(d, dict): continue
            if d.get("@type") == "BreadcrumbList":
                items = sorted(d.get("itemListElement", []), key=lambda x: x.get("position", 0))
                names = [i.get("name") or (i.get("item") or {}).get("name", "") for i in items if isinstance(i, dict)]
                if names: return [n for n in names if n]
            stack.extend(v for v in d.values() if isinstance(v, (dict, list)))
    return []


DUR = re.compile(r"(\d{1,2})\s*N(?:ights?)?\s*[/&,-]?\s*(\d{1,2})\s*D(?:ays?)?", re.I)
DAYS = re.compile(r"(\d{1,2})\s*Days?", re.I)
PRICE = re.compile(r"(?:₹|Rs\.?|INR)\s?([\d,]{4,9})")


class Crawler:
    def __init__(self, args):
        self.a = args
        self.rp = urllib.robotparser.RobotFileParser(BASE + "/robots.txt"); self.rp.read()
        self.lock = threading.Lock(); self.last = 0.0
        self.records = {}; self.discovered = {}; self.redirects = {}; self.blocked = set()
        self.queue = deque(); self.seen = set()

    def throttle(self):
        with self.lock:
            wait = self.last + 1.0 / self.a.rate - time.time()
            if wait > 0: time.sleep(wait)
            self.last = time.time()

    def get(self, url):
        for attempt in range(3):
            self.throttle()
            try:
                with urlopen(Request(url, headers={"User-Agent": UA, "Accept": "text/html,application/xml"}), timeout=30) as r:
                    raw = r.read(3_000_000)
                    cs = r.headers.get_content_charset() or "utf-8"
                    try: body = raw.decode(cs)
                    except (UnicodeDecodeError, LookupError): body = raw.decode("cp1252", "replace")
                    return r.status, r.geturl(), r.headers.get("Content-Type", ""), body, ""
            except HTTPError as e:
                if e.code in (429, 503) and attempt < 2:
                    time.sleep(10 * (attempt + 1)); continue
                return e.code, url, "", "", f"HTTP {e.code}"
            except (URLError, TimeoutError, ConnectionError) as e:
                if attempt < 2: time.sleep(3 * (attempt + 1)); continue
                return 0, url, "", "", f"network: {e}"
        return 0, url, "", "", "retries exhausted"

    def sitemap_urls(self):
        urls = []
        _, _, _, idx, _ = self.get(BASE + "/sitemap_index.xml")
        for sm in re.findall(r"<loc>([^<]+)</loc>", idx):
            _, _, _, body, err = self.get(sm.strip())
            for u in re.findall(r"<loc>([^<]+)</loc>", body):
                if "/wp-content/" in u: continue
                c = canon(u.strip())
                if c: urls.append((c, sm.rsplit("/", 1)[-1]))
        return urls

    def add(self, url, depth, source):
        c = canon(url)
        if not c or urlsplit(c).netloc != HOST or SKIP_EXT.search(urlsplit(c).path): return
        self.discovered.setdefault(c, {"first_seen_via": source, "depth": depth})
        if c in self.seen: return
        if not self.rp.can_fetch(UA, c):
            self.blocked.add(c); self.seen.add(c); return
        if depth > self.a.max_depth: return
        self.seen.add(c); self.queue.append((c, depth))

    def parse(self, url, status, final, ctype, html, err, depth):
        rec = {"source_url": url, "final_url": final, "http_status": status, "crawl_status": "ok" if status == 200 and html else "error",
               "error": err, "crawled_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "depth": depth}
        path = urlsplit(url).path
        rec["page_type"] = page_type(path)
        rec["sitemap"] = self.sitemap_of.get(url, "")
        if rec["page_type"] == "page" and rec["sitemap"] == "post-sitemap.xml": rec["page_type"] = "blog-post"
        segs = [s for s in path.strip("/").split("/") if s]
        rec["parent_category"] = "/" + "/".join(segs[:-1]) + "/" if len(segs) > 1 else "/"
        if not html or "html" not in ctype:
            return rec
        p = Page()
        try: p.feed(html)
        except Exception as e: rec["error"] = f"parse: {e}"
        rec["canonical_url"] = canon(urljoin(url, p.rel.get("canonical", ""))) if p.rel.get("canonical") else ""
        rec["title"] = re.sub(r"\s+", " ", p.title).strip()
        rec["meta_description"] = p.meta.get("description", "")
        rec["meta_robots"] = p.meta.get("robots", "")
        rec["h1"] = p.h1[:3]; rec["h2"] = p.h2[:40]; rec["h3_count"] = len(p.h3)
        crumbs = crumbs_from_ld(p.ld) or p.crumbs[:8]
        rec["breadcrumbs"] = crumbs
        text = " ".join(p.h1 + [rec["title"]])
        m = DUR.search(text) or DUR.search(" ".join(p.h2[:10]))
        rec["nights"], rec["days"] = (int(m.group(1)), int(m.group(2))) if m else (None, None)
        if not m:
            d = DAYS.search(text)
            rec["days"] = int(d.group(1)) if d else None
        rec["package_title"] = p.h1[0] if rec["page_type"] == "package-detail" and p.h1 else ""
        pm = PRICE.search(" ".join(p.h1 + p.h2[:15]))
        rec["displayed_price_inr"] = pm.group(1) if pm else ""
        internal, external = [], 0
        for h in p.links:
            u = canon(urljoin(final or url, h))
            if not u: continue
            if urlsplit(u).netloc == HOST:
                if u not in internal: internal.append(u)
            else: external += 1
        rec["internal_links"] = internal; rec["internal_link_count"] = len(internal); rec["external_link_count"] = external
        imgs = []
        for im in p.images:
            if im not in imgs: imgs.append(im)
        rec["images"] = imgs[:30]; rec["image_count"] = len(imgs)
        rec["images_missing_alt"] = sum(1 for i in imgs if not i["alt"].strip())
        rec["pagination"] = {k: p.rel[k] for k in ("next", "prev") if p.rel.get(k)}
        rec["related_package_links"] = [u for u in internal if "/package/" in u][:40]
        for u in internal: self.add(u, depth + 1, url)
        for k in ("next", "prev"):
            if p.rel.get(k): self.add(urljoin(url, p.rel[k]), depth, url)
        return rec

    def worker(self):
        while True:
            with self.lock:
                if not self.queue or len(self.records) >= self.a.max_pages: return
                url, depth = self.queue.popleft()
                self.records[url] = None
            status, final, ctype, html, err = self.get(url)
            fc = canon(final) if final else url
            if fc and fc != url: self.redirects[url] = fc
            rec = self.parse(url, status, fc, ctype, html, err, depth)
            with self.lock:
                self.records[url] = rec
                n = len(self.records)
            if n % 50 == 0:
                print(f"[{datetime.now():%H:%M:%S}] fetched {n}, queue {len(self.queue)}, discovered {len(self.discovered)}", flush=True)

    def run(self):
        t0 = time.time()
        sm = self.sitemap_urls()
        self.sitemap_count = Counter(s for _, s in sm)
        self.sitemap_set = {u for u, _ in sm}
        self.sitemap_of = {u: s for u, s in sm}
        self.add(BASE + "/", 0, "seed")
        for u, s in sm: self.add(u, 0, "sitemap:" + s)
        threads = [threading.Thread(target=self.worker) for _ in range(self.a.workers)]
        for t in threads: t.start()
        while any(t.is_alive() for t in threads):
            for t in threads: t.join(0.5)
            # workers exit on an empty queue; restart them while parsed pages keep adding links
            if self.queue and len([r for r in self.records]) < self.a.max_pages and not any(t.is_alive() for t in threads):
                threads = [threading.Thread(target=self.worker) for _ in range(self.a.workers)]
                for t in threads: t.start()
        self.elapsed = time.time() - t0
        self.write()

    def write(self):
        OUT.mkdir(exist_ok=True)
        recs = [r for r in self.records.values() if r]
        not_fetched = sorted(u for u in self.discovered if u not in self.records and u not in self.blocked)
        json.dump({"generated_at": datetime.now(timezone.utc).isoformat(timespec="seconds"), "user_agent": UA,
                   "config": vars(self.a), "pages": recs, "discovered_not_fetched": not_fetched,
                   "blocked_by_robots": sorted(self.blocked), "redirects": self.redirects},
                  open(OUT / "gt-holidays-url-inventory.json", "w", encoding="utf-8"), indent=1, ensure_ascii=False)
        cols = ["source_url", "canonical_url", "final_url", "http_status", "crawl_status", "error", "page_type", "sitemap", "parent_category",
                "title", "meta_description", "h1", "h2", "breadcrumbs", "package_title", "nights", "days", "displayed_price_inr",
                "internal_link_count", "external_link_count", "image_count", "images_missing_alt", "pagination", "depth", "crawled_at"]
        with open(OUT / "gt-holidays-url-inventory.csv", "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f); w.writerow(cols)
            for r in recs:
                w.writerow([" | ".join(r.get(c) or []) if isinstance(r.get(c), list) else json.dumps(r[c]) if isinstance(r.get(c), dict) else r.get(c, "") for c in cols])
            for u in not_fetched: w.writerow([u] + [""] * 3 + ["discovered-not-fetched"] + [""] * (len(cols) - 5))
            for u in sorted(self.blocked): w.writerow([u] + [""] * 3 + ["blocked-by-robots"] + [""] * (len(cols) - 5))
        print(f"done: {len(recs)} fetched, {len(not_fetched)} not fetched, {len(self.blocked)} blocked, {self.elapsed:.0f}s")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--max-pages", type=int, default=2500)
    ap.add_argument("--max-depth", type=int, default=2)
    ap.add_argument("--rate", type=float, default=1.0, help="requests per second (global)")
    ap.add_argument("--workers", type=int, default=2)
    c = Crawler(ap.parse_args()); c.run()
    json.dump({"sitemap_counts": c.sitemap_count, "sitemap_urls": sorted(c.sitemap_set), "elapsed_s": round(c.elapsed)},
              open(OUT / ".crawl-meta.json", "w"), indent=1)
