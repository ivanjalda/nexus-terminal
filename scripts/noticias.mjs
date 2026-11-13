// Noticias de mercado: lee titulares de varios medios (RSS público) y guarda noticias.json.
// Solo se guarda titular, medio, fecha y enlace a la fuente original. No se copia texto ni imágenes.
// Si un medio falla, se salta; si fallan todos, el archivo anterior se conserva.
import fs from "node:fs";

const FEEDS = {
  es: {
    a: [ // mercados
      { s: "Expansión", u: "https://e00-expansion.uecdn.es/rss/mercados.xml" },
      { s: "Cinco Días", u: "https://feeds.elpais.com/mrss-s/pages/ep/site/cincodias.elpais.com/portada" },
      { s: "Investing.com", u: "https://es.investing.com/rss/news_25.rss" },
    ],
    b: [ // economía y empresas
      { s: "Expansión", u: "https://e00-expansion.uecdn.es/rss/empresas.xml" },
      { s: "Expansión", u: "https://e00-expansion.uecdn.es/rss/economia.xml" },
      { s: "Europa Press", u: "https://www.europapress.es/rss/rss.aspx?ch=136" },
    ],
  },
  en: {
    a: [
      { s: "CNBC", u: "https://www.cnbc.com/id/15839069/device/rss/rss.html" },
      { s: "MarketWatch", u: "https://feeds.content.dowjones.io/public/rss/mw_marketpulse" },
      { s: "Yahoo Finance", u: "https://finance.yahoo.com/news/rssindex" },
    ],
    b: [
      { s: "CNBC", u: "https://www.cnbc.com/id/20910258/device/rss/rss.html" },
      { s: "CNBC", u: "https://www.cnbc.com/id/10001147/device/rss/rss.html" },
    ],
  },
};
const MAX_AGE_DAYS = 4, PER_SOURCE = 4, TOTAL = 12;
const OUT = process.argv[2] || "noticias.json";
const OVERRIDE = process.env.NOTICIAS_FEEDS ? JSON.parse(process.env.NOTICIAS_FEEDS) : null; // solo para pruebas

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
function clean(x) {
  if (!x) return "";
  let s = String(x).replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1");
  s = s.replace(/<[^>]+>/g, " ");
  s = s.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, e) => {
    if (e[0] === "#") { const n = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10); return Number.isFinite(n) ? String.fromCodePoint(n) : m; }
    return ENT[e] ?? m;
  });
  // por si el medio escapó dos veces
  s = s.replace(/&(amp|lt|gt|quot|apos);/g, (m, e) => ENT[e]);
  return s.replace(/\s+/g, " ").trim();
}
const tag = (blk, name) => { const m = blk.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i")); return m ? m[1] : ""; };
function parse(xml) {
  const items = [];
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  for (const b of blocks) {
    const t = clean(tag(b, "title"));
    let u = clean(tag(b, "link"));
    if (!u) { const m = b.match(/<link[^>]*href=["']([^"']+)["']/i); if (m) u = m[1]; }
    if (!u) u = clean(tag(b, "guid"));
    const d = clean(tag(b, "pubDate") || tag(b, "published") || tag(b, "updated") || tag(b, "dc:date"));
    const ms = Date.parse(d);
    if (!t || !/^https?:\/\//i.test(u) || !Number.isFinite(ms)) continue;
    items.push({ t, u, ms });
  }
  return items;
}
async function get(url) {
  const ac = new AbortController(); const to = setTimeout(() => ac.abort(), 15000);
  try {
    const r = await fetch(url, { signal: ac.signal, headers: { "User-Agent": "Mozilla/5.0 (compatible; NexusTerminalBot/1.0; +https://nexusterminalalerts.com)", Accept: "application/rss+xml, application/xml, text/xml, */*" } });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return await r.text();
  } finally { clearTimeout(to); }
}
const norm = (t) => t.toLowerCase().replace(/[^a-z0-9áéíóúñ ]/g, "").slice(0, 60);

async function main() {
  const feeds = OVERRIDE || FEEDS, ok = [], fail = [], now = Date.now();
  const out = { generado: new Date().toISOString(), es: { a: [], b: [] }, en: { a: [], b: [] } };
  for (const lang of Object.keys(feeds)) for (const col of Object.keys(feeds[lang])) {
    const all = [];
    for (const f of feeds[lang][col]) {
      try {
        const items = parse(await get(f.u)).filter((i) => i.ms <= now + 3600e3 && now - i.ms < MAX_AGE_DAYS * 864e5);
        if (!items.length) throw new Error("sin titulares");
        ok.push(`${f.s} (${lang}/${col}): ${items.length}`);
        items.sort((x, y) => y.ms - x.ms).slice(0, PER_SOURCE * 2).forEach((i) => all.push({ ...i, s: f.s }));
      } catch (e) { fail.push(`${f.s} (${lang}/${col}): ${e.message || e}`); }
    }
    all.sort((x, y) => y.ms - x.ms);
    const seen = new Set(), per = {}, pick = [];
    for (const i of all) {
      const k = norm(i.t); if (seen.has(k)) continue;
      per[i.s] = (per[i.s] || 0) + 1; if (per[i.s] > PER_SOURCE) continue;
      seen.add(k); pick.push({ t: i.t, u: i.u, s: i.s, d: new Date(i.ms).toISOString() });
      if (pick.length >= TOTAL) break;
    }
    out[lang][col] = pick;
  }
  console.log("Medios que respondieron:\n  " + (ok.join("\n  ") || "ninguno"));
  console.log("Medios que NO respondieron:\n  " + (fail.join("\n  ") || "ninguno"));
  const total = ["es", "en"].reduce((n, l) => n + out[l].a.length + out[l].b.length, 0);
  if (!total) { console.log("Ningún titular nuevo: se conserva el archivo anterior."); return; }
  fs.writeFileSync(OUT, JSON.stringify(out));
  console.log("noticias.json escrito: es " + out.es.a.length + "+" + out.es.b.length + ", en " + out.en.a.length + "+" + out.en.b.length);
}
main().catch((e) => { console.error(e); process.exit(0); });
