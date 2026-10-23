// Tiny Markdown subset for guides and blog posts: ## / ### headings, paragraphs, - and 1. lists,
// | tables |, > quotes, **bold**, *italic*, [text](url) and [[slug]] / [[slug|text]] internal links.
import { esc, slugify } from "./html.mjs";

export function renderMd(src, resolve, onMissing) {
  const inline = s => esc(s)
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (m, k, t) => { const r = resolve(k.trim()); if (!r) { onMissing?.(k.trim()); return t || k } return `<a href="${r.url}">${t || r.name}</a>` })
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' target="_blank" rel="noopener"' : ""}>${t}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  const out = [], toc = [], lines = src.replace(/\r/g, "").trim().split("\n");
  let i = 0;
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue }
    let m;
    if ((m = l.match(/^(#{2,3})\s+(.*)/))) {
      const id = slugify(m[2]).slice(0, 60); if (m[1] == "##") toc.push([m[2], id]);
      out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); i++; continue;
    }
    if (/^\s*[-*]\s+/.test(l) || /^\s*\d+\.\s+/.test(l)) {
      const ol = /^\s*\d+\./.test(l), items = [];
      while (i < lines.length && (ol ? /^\s*\d+\.\s+/ : /^\s*[-*]\s+/).test(lines[i])) items.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/, ""));
      out.push(`<${ol ? "ol" : "ul"}>${items.map(x => `<li>${inline(x)}</li>`).join("")}</${ol ? "ol" : "ul"}>`); continue;
    }
    if (l.startsWith("|")) {
      const rows = []; while (i < lines.length && lines[i].startsWith("|")) rows.push(lines[i++]);
      const cells = r => r.replace(/^\||\|$/g, "").split("|").map(c => c.trim());
      const head = cells(rows[0]), body = rows.slice(/^\|[\s:-]+\|/.test(rows[1] || "") ? 2 : 1).map(cells);
      out.push(`<div class="tbl-wrap"><table><thead><tr>${head.map(c => `<th>${inline(c)}</th>`).join("")}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${inline(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`); continue;
    }
    if (l.startsWith(">")) { const q = []; while (i < lines.length && lines[i].startsWith(">")) q.push(lines[i++].replace(/^>\s?/, "")); out.push(`<blockquote>${inline(q.join(" "))}</blockquote>`); continue }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|\s*[-*]\s|\s*\d+\.\s|\||>)/.test(lines[i])) p.push(lines[i++]);
    out.push(`<p>${inline(p.join(" "))}</p>`);
  }
  return { html: out.join("\n"), toc, words: src.split(/\s+/).filter(w => /[a-z]/i.test(w)).length };
}
