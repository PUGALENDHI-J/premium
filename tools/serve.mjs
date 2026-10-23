// Local preview server with the same clean-URL rules as static hosts. Usage: node tools/serve.mjs [port]
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = +process.argv[2] || 4321; // 8080 is often taken by other local servers (e.g. EDB Postgres)
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".xml": "application/xml", ".txt": "text/plain", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".mp4": "video/mp4", ".svg": "image/svg+xml" };

createServer(async (req, res) => {
  let p;
  try { p = decodeURIComponent(new URL(req.url.replace(/^\/+/, "/"), "http://x").pathname) } catch { res.writeHead(400).end(); return }
  let file = path.join(ROOT, p);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return }
  try {
    const s = await stat(file);
    if (s.isDirectory()) {
      if (!p.endsWith("/")) { res.writeHead(301, { Location: p + "/" }).end(); return }
      file = path.join(file, "index.html");
    }
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" }).end(body);
  } catch {
    res.writeHead(404, { "Content-Type": TYPES[".html"] }).end(await readFile(path.join(ROOT, "404.html")).catch(() => "Not found"));
  }
}).listen(PORT, () => console.log(`Serving ${ROOT} at http://localhost:${PORT}/`));
