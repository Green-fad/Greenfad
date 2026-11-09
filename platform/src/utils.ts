// GREEN FAD — utilitaires partagés
export function ulid(): string {
  let s = "";
  const A = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(26));
  for (const b of bytes) s += A[b % 32];
  return s;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function esc(s: unknown): string {
  if (s == null) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Markdown minimal et sûr → HTML (titres, gras, italique, listes, liens, images, blocs) */
export function md(src: unknown): string {
  if (!src) return "";
  const srcText = String(src);
  const lines = srcText.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  let inList = false;
  let inCode = false;
  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };
  const inline = (s: string) =>
    esc(s)
      .replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt: string, url: string) =>
        /^\/[^\/]|^https?:|^\/media\//.test(url)
          ? `<img src="${url}" alt="${alt}" loading="lazy">`
          : alt
      )
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, t: string, url: string) =>
        /^https?:|^\/|#|^mailto:|^tel:/.test(url) ? `<a href="${url}" ${url.startsWith("http") ? 'target="_blank" rel="noopener"' : ""}>${t}</a>` : t
      )
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|\W)\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>");
  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("```")) {
      closeList();
      out.push(inCode ? "</code></pre>" : "<pre><code>");
      inCode = !inCode;
      continue;
    }
    if (inCode) {
      out.push(esc(line));
      continue;
    }
    const h = /^(#{1,4})\s+(.*)$/.exec(line);
    if (h) {
      closeList();
      const lvl = h[1].length;
      out.push(`<h${lvl + 1}>${inline(h[2])}</h${lvl + 1}>`);
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      closeList();
      out.push(`<p><strong>${line.match(/^(\d+)\./)![1]}.</strong> ${inline(line.replace(/^\d+\.\s+/, ""))}</p>`);
      continue;
    }
    if (line.startsWith("> ")) {
      closeList();
      out.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`);
      continue;
    }
    if (!line.trim()) {
      closeList();
      continue;
    }
    closeList();
    out.push(`<p>${inline(line)}</p>`);
  }
  closeList();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}

export function parseJSON<T>(s: unknown, fallback: T): T {
  if (!s) return fallback;
  try {
    return JSON.parse(String(s)) as T;
  } catch {
    return fallback;
  }
}

/** Retire le premier titre H1 d'un markdown — le titre de page (h1 principal) ne doit jamais être dupliqué dans le corps. */
export function stripFirstH1(src: unknown): string {
  const text = String(src || "");
  return text.replace(/^\s*#\s+[^\n]+\n+/, "");
}

export function excerptFromMd(src: unknown, len = 180): string {
  if (!src) return "";
  const text = String(src)
    .replace(/[#>*`!\[\]\(\)]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= len) return text;
  // Coupe sur la frontière du mot précédent : jamais de mot tronqué en plein milieu
  const cut = text.slice(0, len);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > len * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + "…";
}

export function fmtDate(iso: unknown, style: "short" | "long" = "long"): string {
  if (!iso) return "";
  const d = new Date(String(iso).replace(" ", "T") + (String(iso).endsWith("Z") ? "" : "Z"));
  if (isNaN(d.getTime())) return String(iso);
  const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const monthsShort = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept.", "oct.", "nov.", "déc."];
  const mm = style === "short" ? monthsShort : months;
  return `${d.getUTCDate()} ${mm[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function fmtBytes(n: number | null | undefined): string {
  if (!n) return "0";
  const units = ["o", "Ko", "Mo", "Go"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${v.toFixed(i ? 1 : 0)} ${units[i]}`;
}

/** Clé média → URL publique : les clés « /assets/… » sont servies en statique, les autres via R2 (/media/…) */
export function mediaSrc(key: string | null | undefined): string {
  if (!key) return "";
  return key.startsWith("/") ? key : `/media/${key}`;
}
