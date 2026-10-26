// Usage: node generate.mjs <repoRoot> <outDir>
// Writes <outDir>/reference/*.html and <outDir>/model/generated.c4.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync, rmSync } from 'node:fs';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHeader } from './parse.mjs';
import { buildModelData } from './map.mjs';

const SITE = '/sig-docs/'; // LikeC4 emits link URLs verbatim, so they must be absolute
const BASE = `${SITE}reference/`;

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const pageName = (header) => basename(header, '.h');

/**
 * Element ids declared in the hand-written model files (*.c4 except generated.c4).
 * Comments and strings are blanked, then a brace-depth walk tracks the enclosing
 * `name = kind ...` declarations. Only declarations reached through `model { }`
 * and other element bodies count, as do `extend <path> { }` bodies, whose
 * declarations take <path> as prefix (not views, specification, metadata).
 * A declaration is a statement (text since the last `{`, `}` or newline)
 * matching `ident = kind`. Ids are dotted paths, e.g. sig.service.queue.
 */
export function declaredIds(modelDir) {
  const ids = new Set();
  if (!existsSync(modelDir)) return ids;
  for (const f of readdirSync(modelDir).sort()) {
    if (!f.endsWith('.c4') || f === 'generated.c4') continue;
    let t = readFileSync(join(modelDir, f), 'utf8');
    // One pass so the earliest token wins: a `//` inside a string is not a comment.
    t = t.replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:[^'\\]|\\[\s\S])*'|"(?:[^"\\]|\\[\s\S])*"|`(?:[^`\\]|\\[\s\S])*`/g,
      (m) => m.replace(/[^\n]/g, ' '));
    const stack = []; // each entry: element id, 'model', or null (other block)
    let seg = '';
    const path = () => stack.filter((s) => s && s !== 'model').join('.');
    const inModel = () => stack.length > 0 && stack.every((s) => s !== null);
    const finish = (opens) => {
      const m = /^\s*([A-Za-z_][\w-]*)\s*=\s*[A-Za-z_][\w-]*\b/.exec(seg);
      let entry = null;
      let ext;
      if (m && inModel()) {
        const p = path();
        ids.add(p ? `${p}.${m[1]}` : m[1]);
        entry = m[1];
      } else if (/^\s*model\s*$/.test(seg) && stack.length === 0) entry = 'model';
      else if (inModel() && (ext = /^\s*extend\s+([A-Za-z_][\w-]*(?:\.[A-Za-z_][\w-]*)*)\s*$/.exec(seg))) {
        entry = ext[1]; // an extend body continues the extended (dotted) path
      }
      if (opens) stack.push(entry);
      seg = '';
    };
    for (const ch of t) {
      if (ch === '{') finish(true);
      else if (ch === '}') { finish(false); stack.pop(); }
      else if (ch === '\n') finish(false);
      else seg += ch;
    }
  }
  return ids;
}

const CSS = `:root{color-scheme:light dark;--bg:#fff;--fg:#1b1f24;--mut:#59636e;--bd:#d0d7de;--code:#f6f8fa;--note:#fff8c5;--lnk:#0969da}
@media (prefers-color-scheme:dark){:root{--bg:#0d1117;--fg:#e6edf3;--mut:#9198a1;--bd:#30363d;--code:#161b22;--note:#3b2e00;--lnk:#58a6ff}}
body{background:var(--bg);color:var(--fg);font:16px/1.5 system-ui,sans-serif;margin:0 auto;max-width:56rem;padding:1rem 16px 3rem}
a{color:var(--lnk)}code,pre{font-family:ui-monospace,Menlo,monospace;font-size:.9em}
pre{background:var(--code);padding:.6rem .8rem;overflow-x:auto;border-radius:6px}
.note{background:var(--note);border-left:4px solid var(--bd);padding:.5rem .8rem;margin:1rem 0;white-space:pre-wrap}
.item{border-top:1px solid var(--bd);margin-top:1.5rem;padding-top:.5rem}
.doc{white-space:pre-wrap;color:var(--fg)}table{border-collapse:collapse}th,td{border:1px solid var(--bd);padding:.25rem .6rem;text-align:left}
nav{color:var(--mut)}.shared{color:var(--mut);font-size:.9em;margin:.4rem 0 0}`;

const page = (title, body) => `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>${CSS}</style></head>
<body>
${body}
</body></html>
`;

function renderItem(it, idOf) {
  if (it.kind === 'note') return `<div class="note">${esc(it.text)}</div>`;
  const id = idOf(it.kind === 'macro' ? `macro-${it.name}` : it.name);
  const shared = it.docShared ? `<p class="shared">shared with <a href="#${esc(it.docFrom)}">${esc(it.docFrom)}</a></p>` : '';
  const doc = it.doc ? `${shared}<p class="doc">${esc(it.doc)}</p>` : '';
  const sect = (body) => `<section class="item" id="${esc(id)}"><h3>${esc(it.name)}</h3>${body}${doc}</section>`;
  if (it.kind === 'type' || it.kind === 'data' || it.kind === 'macro') return sect(`<pre>${esc(it.text)}</pre>`);
  const params = it.params.length
    ? `<table><thead><tr><th>Parameter</th><th>Type</th></tr></thead><tbody>${
      it.params.map((p) => `<tr><td><code>${esc(p.name || '')}</code></td><td><code>${esc(p.type)}</code></td></tr>`).join('')
    }</tbody></table>`
    : '';
  return sect(`<pre>${esc(it.signature)}</pre>${params}`);
}

/** Section ids unique within a page: a repeat (e.g. one name in both #if branches) gets -2, -3... */
function idMaker() {
  const seen = new Map();
  return (base) => {
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    return n === 1 ? base : `${base}-${n}`;
  };
}

/**
 * @param {string} repoRoot
 * @param {string} outDir
 * @param {{headerArea?:object, components?:object, declared?:Set<string>}} [opts]
 */
export function generate(repoRoot, outDir, opts = {}) {
  const { areas, components } = buildModelData(repoRoot, opts);
  const declared = opts.declared ?? declaredIds(join(outDir, 'model'));
  const refDir = join(outDir, 'reference');
  rmSync(refDir, { recursive: true, force: true }); // no stale pages from removed headers
  mkdirSync(refDir, { recursive: true });
  mkdirSync(join(outDir, 'model'), { recursive: true });

  // Every id the fragment extends must exist in the hand-written model.
  const want = new Set(['sig', ...components.keys(), ...[...areas.keys()].map((a) => `sig.${a}`)]);
  const missing = [...want].filter((id) => !declared.has(id)).sort();
  if (missing.length) {
    throw new Error(`sigdoc: ids not declared in model/*.c4 (components.json or areas.mjs name them):\n  ${missing.join('\n  ')}`);
  }

  const q = (s) => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const fnHeader = new Map(); // function name -> header path
  const indexSections = [];
  const moduleBlocks = [];
  for (const [area, a] of [...areas].sort((x, y) => (x[0] < y[0] ? -1 : 1))) {
    const links = [];
    const modLinks = [];
    for (const h of a.headers) {
      const { items } = parseHeader(readFileSync(join(repoRoot, h), 'utf8'), h);
      for (const it of items) if (it.kind === 'function') fnHeader.set(it.name, h);
      const name = pageName(h);
      const nFns = items.filter((i) => i.kind === 'function').length;
      const idOf = idMaker();
      writeFileSync(join(refDir, `${name}.html`), page(`${name}.h - libsig reference`,
        `<nav><a href="index.html">Reference index</a> / ${esc(area)} / <a href="${SITE}">Architecture site</a></nav>\n<h1>${esc(basename(h))}</h1>\n<p><code>${esc(h)}</code></p>\n${items.map((it) => renderItem(it, idOf)).join('\n')}`));
      links.push(`<li><a href="${esc(name)}.html">${esc(basename(h))}</a> (${nFns} functions)</li>`);
      modLinks.push(`  link ${BASE}${name}.html '${q(basename(h))}'\n`);
    }
    indexSections.push(`<h2>${esc(area)}</h2><ul>${links.join('')}</ul>`);
    moduleBlocks.push(`extend sig.${area} {\n${modLinks.join('')}}\n`);
  }
  writeFileSync(join(refDir, 'index.html'), page('libsig header reference',
    `<nav><a href="${SITE}">Architecture site</a></nav>\n<h1>libsig header reference</h1>\n${indexSections.join('\n')}`));

  const blocks = [`extend sig {\n  link ${BASE}index.html 'API reference (generated from headers)'\n}\n`, ...moduleBlocks];
  for (const [id, fns] of components) {
    if (!fns.length) continue;
    const hdrs = [...new Set(fns.map((f) => fnHeader.get(f.name)))].sort();
    blocks.push(`extend ${id} {\n  metadata {\n    functions '${q(fns.map((f) => f.name).join(', '))}'\n  }\n${
      hdrs.map((h) => `  link ${BASE}${pageName(h)}.html '${q(basename(h))}'\n`).join('')}}\n`);
  }
  writeFileSync(join(outDir, 'model/generated.c4'),
    `// GENERATED by tools/sigdoc/generate.mjs - do not edit.\nmodel {\n${blocks.map((b) => b.replace(/^(?=.)/gm, "  ")).join('\n')}}\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [repoRoot, outDir] = process.argv.slice(2);
  if (!repoRoot || !outDir) { console.error('usage: generate.mjs <repoRoot> <outDir>'); process.exit(2); }
  generate(repoRoot, outDir);
}
