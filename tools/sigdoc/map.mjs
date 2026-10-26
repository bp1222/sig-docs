import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseHeader } from './parse.mjs';
import { HEADER_AREA, AREAS } from './areas.mjs';

const here = dirname(fileURLToPath(import.meta.url));

function walk(root, rel, out, optional = false) {
  let ents;
  try { ents = readdirSync(join(root, rel), { withFileTypes: true }); } catch (e) {
    if (optional && e.code === 'ENOENT') return;
    throw new Error(`sigdoc: cannot read ${join(root, rel)}: ${e.message}`);
  }
  for (const e of ents.sort((a, b) => (a.name < b.name ? -1 : 1))) {
    const r = `${rel}/${e.name}`;
    if (e.isDirectory()) walk(root, r, out, optional);
    else if (e.name.endsWith('.h')) out.push(r);
  }
}

const matches = (pat, name) =>
  pat.endsWith('*') ? name.startsWith(pat.slice(0, -1)) : pat === name;

/**
 * @param {string} repoRoot
 * @param {{headerArea?: object, components?: object}} [opts] overrides (tests)
 */
export function buildModelData(repoRoot, opts = {}) {
  const headerArea = opts.headerArea ?? HEADER_AREA;
  const comps = opts.components
    ?? JSON.parse(readFileSync(join(here, 'components.json'), 'utf8'));
  const problems = [];
  const areas = new Map();
  const components = new Map();
  const owner = new Map();
  for (const [area, cs] of Object.entries(comps)) {
    for (const id of Object.keys(cs)) {
      if (components.has(id)) problems.push(`duplicate component id ${id} (area ${area} and ${owner.get(id)})`);
      components.set(id, []);
      owner.set(id, area);
    }
  }

  const headers = [];
  walk(repoRoot, 'include', headers);
  walk(repoRoot, 'host/include', headers, true);
  if (!headers.length) throw new Error(`sigdoc: no headers found under ${repoRoot}/include`);

  for (const h of headers) {
    const area = Object.hasOwn(headerArea, h) ? headerArea[h] : undefined;
    if (!area) { problems.push(`header has no area: ${h}`); continue; }
    if (!areas.has(area)) areas.set(area, { headers: [], functions: [], types: [], notes: [] });
    const a = areas.get(area);
    a.headers.push(h);
    const { items } = parseHeader(readFileSync(join(repoRoot, h), 'utf8'), h);
    for (const it of items) {
      if (it.kind === 'type') a.types.push(it);
      else if (it.kind === 'note') a.notes.push(it);
      else if (it.kind === 'function') {
        a.functions.push(it);
        let hit = false;
        for (const [id, pats] of Object.entries(comps[area] ?? {})) {
          if (pats.some((p) => matches(p, it.name))) { components.get(id).push(it); hit = true; }
        }
        if (!hit) problems.push(`function matches no component in area ${area}: ${it.name} (${h})`);
      }
    }
  }
  if (problems.length) throw new Error(`sigdoc mapping problems:\n  ${problems.join('\n  ')}`);
  return { areas, components };
}
