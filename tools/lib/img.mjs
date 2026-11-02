// Responsive photos: every lazy <img> of a site photo gets a srcset of its xs/ (600 px, tools/photos_xs.py), sm/ and full
// copies with sizes="auto", so the browser loads and decodes the smallest copy that covers the box. A 46 px icon used to
// decode a 2200 px photo, which made scrolling stutter. Each copy is described by its short side, so a portrait box that
// crops a landscape photo (object-fit:cover) still gets enough pixels. A tag that names the sm/ copy never gets the full
// one, so no image becomes heavier than before. Browsers without sizes="auto" fall back to 100vw, as before.
import { existsSync, openSync, readSync, closeSync } from "node:fs";
import path from "node:path";

const dims = new Map();
// width and height from a WebP header (VP8, VP8L or VP8X)
function webpSize(file) {
  if (dims.has(file)) return dims.get(file);
  let d = null;
  if (existsSync(file)) {
    const b = Buffer.alloc(30), fd = openSync(file, "r");
    readSync(fd, b, 0, 30, 0); closeSync(fd);
    const kind = b.toString("ascii", 12, 16);
    if (kind == "VP8 ") d = [b.readUInt16LE(26) & 0x3fff, b.readUInt16LE(28) & 0x3fff];
    else if (kind == "VP8L") { const n = b.readUInt32LE(21); d = [(n & 0x3fff) + 1, ((n >> 14) & 0x3fff) + 1] }
    else if (kind == "VP8X") d = [b.readUIntLE(24, 3) + 1, b.readUIntLE(27, 3) + 1];
  }
  dims.set(file, d);
  return d;
}

export function srcsetFor(root, src) {
  const m = src.match(/^(\/?assets\/(?:photos(?:\/(?!sm\/|xs\/)[a-z]+)?|exp))\/(?:(sm|xs)\/)?([^/]+\.webp)$/);
  if (!m) return "";
  const [, dir, kind, name] = m;
  const copies = [`${dir}/xs/${name}`, `${dir}/sm/${name}`];
  if (kind != "sm" && kind != "xs") copies.push(`${dir}/${name}`);
  const seen = new Set(), list = [];
  for (const c of copies) {
    const d = webpSize(path.join(root, c.replace(/^\//, "")));
    if (!d) continue;
    const w = Math.min(...d);
    if (seen.has(w)) continue;
    seen.add(w); list.push(`${c} ${w}w`);
  }
  return list.length > 1 ? list.join(", ") : "";
}

// Browsers give an <img sizes="auto"> size containment with a 300x150 placeholder size (HTML spec UA style), which
// changes any box that is sized by its image. --ar and --cis carry the src photo's own size, and a zero-specificity rule
// in index.html's <style> (:where(img[sizes^="auto"])) applies them, so layout is exactly as without the srcset.
export function responsive(root, html) {
  return html.replace(/<img\b[^>]*>/g, tag => {
    if (/\ssrcset=/.test(tag) || !/\sloading="lazy"/.test(tag)) return tag;
    const src = tag.match(/\ssrc="([^"]+)"/)?.[1];
    const set = src && srcsetFor(root, src), d = set && webpSize(path.join(root, src.replace(/^\//, "")));
    if (!d) return tag;
    const size = `--ar:${d[0]}/${d[1]};--cis:${d[0]}px ${d[1]}px`;
    tag = /\sstyle="/.test(tag) ? tag.replace(/\sstyle="([^"]*?);?"/, (_, s) => ` style="${s};${size}"`) : tag.replace(/\s*\/?>$/, ` style="${size}">`);
    return tag.replace(/\s*\/?>$/, ` srcset="${set}" sizes="auto, 100vw"${/\sdecoding=/.test(tag) ? "" : ' decoding="async"'}>`);
  });
}
