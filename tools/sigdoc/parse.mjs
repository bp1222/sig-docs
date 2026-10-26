// Hand-written parser for the libsig public C headers. No dependencies.
// See the typedefs below for the result shape.

/** @typedef {{type:string,name:string}} Param */
/** @typedef {{kind:'function',name:string,returns:string,params:Param[],signature:string,doc:string|null,line:number}} Fn */
/** @typedef {{kind:'type',name:string,text:string,doc:string|null,line:number}} TypeDecl */
/** @typedef {{kind:'data',name:string,type:string,text:string,doc:string|null,line:number}} Data */
/** @typedef {{kind:'macro',name:string,params:string[]|null,text:string,doc:string|null,line:number}} Macro */
/** @typedef {{kind:'note',text:string,line:number}} Note */

const squash = (s) => s.replace(/\s+/g, ' ').trim();

/** Blank comments, strings, char literals and preprocessor lines (keeping
 *  newlines so offsets and line numbers still match the source). */
function scan(text) {
  const out = text.split('');
  const comments = []; // {start,end,text,line?}
  const directives = []; // {start,end}
  const n = text.length;
  let i = 0;
  let lineStart = true;
  const blank = (a, b) => { for (let k = a; k < b; k++) if (out[k] !== '\n') out[k] = ' '; };
  while (i < n) {
    const c = text[i];
    if (c === '\n') { lineStart = true; i++; continue; }
    if (lineStart && (c === ' ' || c === '\t')) { i++; continue; }
    if (lineStart && c === '#') {
      // preprocessor line, with backslash continuations; comments inside are still recorded below as blanked text
      let j = i;
      while (j < n) {
        if (text[j] === '\n') { if (text[j - 1] === '\\' || (text[j - 1] === '\r' && text[j - 2] === '\\')) { j++; continue; } break; }
        if (text[j] === '/' && text[j + 1] === '*') { const e = text.indexOf('*/', j + 2); j = e < 0 ? n : e + 2; continue; }
        j++;
      }
      directives.push({ start: i, end: j });
      blank(i, j);
      i = j;
      continue;
    }
    lineStart = false;
    if (c === '/' && text[i + 1] === '*') {
      const e = text.indexOf('*/', i + 2);
      const end = e < 0 ? n : e + 2;
      comments.push({ start: i, end, text: text.slice(i, end) });
      blank(i, end);
      i = end;
    } else if (c === '/' && text[i + 1] === '/') {
      let j = text.indexOf('\n', i);
      if (j < 0) j = n;
      comments.push({ start: i, end: j, text: text.slice(i, j), line: true });
      blank(i, j);
      i = j;
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== '\n') j += text[j] === '\\' ? 2 : 1;
      blank(i + 1, Math.min(j, n));
      i = j + 1;
    } else i++;
  }
  return { clean: out.join(''), comments, directives };
}

function commentText(raw) {
  if (raw.startsWith('//')) return raw.replace(/^\/\/ ?/, '').trim();
  return raw
    .replace(/^\/\*+/, '')
    .replace(/\*+\/$/, '')
    .split('\n')
    .map((l) => l.replace(/^\s*\*? ?/, '').replace(/\s+$/, ''))
    .join('\n')
    .trim();
}

/** Split a declaration into statements at top-level `;`, looking through extern "C" blocks. */
function statements(clean) {
  const res = [];
  let depth = 0, externs = 0, begin = -1;
  const reset = () => { begin = -1; };
  for (let i = 0; i < clean.length; i++) {
    const c = clean[i];
    if (begin < 0) { if (/\s/.test(c)) continue; if (c === '}' && depth === 0 && externs > 0) { externs--; continue; } if (c === ';') continue; begin = i; }
    if (c === '{') {
      if (depth === 0 && /^extern\s*"\s*"\s*$/.test(clean.slice(begin, i))) { externs++; reset(); continue; }
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        const head = clean.slice(begin, clean.indexOf('{', begin)).trim();
        if (head.endsWith(')')) { res.push({ start: begin, end: i + 1 }); reset(); }
      }
    } else if (c === ';' && depth === 0) {
      res.push({ start: begin, end: i + 1 });
      reset();
    }
  }
  if (begin >= 0) res.push({ start: begin, end: clean.length, open: true });
  return res;
}

function splitTop(s) {
  const parts = [];
  let d = 0, cur = '';
  for (const c of s) {
    if (c === '(' || c === '[') d++;
    else if (c === ')' || c === ']') d--;
    if (c === ',' && d === 0) { parts.push(cur); cur = ''; } else cur += c;
  }
  parts.push(cur);
  return parts;
}

function parseParam(raw) {
  const p = squash(raw);
  if (p === '...') return { type: '...', name: '' };
  const fp = p.match(/^(.*?\(\s*\*\s*)(\w+)(\s*\).*)$/); // function pointer: ret (*name)(args)
  if (fp) return { type: squash(fp[1] + fp[3]).replace('( *', '(*').replace('(* )', '(*)'), name: fp[2] };
  const arr = p.match(/^(.*?)(\w+)\s*((?:\[[^\]]*\])+)$/);
  if (arr) return { type: squash(`${arr[1]} ${arr[3]}`), name: arr[2] };
  const m = p.match(/^(.*?)(\w+)$/);
  if (!m || !m[1].trim()) return { type: p, name: '' }; // unnamed, e.g. `int` or `const char *`
  const KW = /^(?:int|char|short|long|unsigned|signed|float|double|void|const|struct|enum)$/;
  if (KW.test(m[2]) && !/[*]\s*$/.test(m[1])) return { type: p, name: '' };
  if (/(?:^|\s)(?:struct|enum|union)\s*$/.test(m[1])) return { type: p, name: '' };
  return { type: squash(m[1]), name: m[2] };
}

function parseFunction(src, file, line) {
  const fail = (why) => { throw new Error(`${file}:${line}: ${why}`); };
  let body = squash(src.replace(/^SIG_PUBLIC\b/, '').replace(/;\s*$/, ''));
  const open = body.indexOf('(');
  if (open < 0) fail('SIG_PUBLIC declaration has no parameter list');
  let d = 0, close = -1;
  for (let i = open; i < body.length; i++) {
    if (body[i] === '(') d++;
    else if (body[i] === ')' && --d === 0) { close = i; break; }
  }
  if (close < 0) fail('unbalanced parentheses in SIG_PUBLIC declaration');
  const head = body.slice(0, open).trim();
  const m = head.match(/^(.*?)(\w+)$/);
  if (!m || !m[1].trim()) fail('cannot find a return type and function name');
  const returns = squash(m[1]);
  const inner = body.slice(open + 1, close).trim();
  let params = [];
  if (inner !== '' && inner !== 'void') {
    params = splitTop(inner).map(parseParam);
    if (params.some((p) => !p.type)) fail('empty parameter');
  }
  const signature = `${returns} ${m[2]}(${params.map((p) => (p.name ? `${p.type} ${p.name}` : p.type)).join(', ')})`;
  return { kind: 'function', name: m[2], returns, params, signature, line };
}

function typeName(src) {
  let s = squash(src.replace(/;\s*$/, ''));
  if (s.includes('{')) {
    const after = s.slice(s.lastIndexOf('}') + 1).trim();
    const nm = after.match(/(\w+)\s*(?:\[[^\]]*\])*$/);
    if (/^typedef\b/.test(s)) return nm ? nm[1] : '';
    const head = s.slice(0, s.indexOf('{')).match(/\b(?:struct|enum|union)\s+(\w+)\s*$/);
    return head ? head[1] : '';
  }
  const fp = s.match(/\(\s*\*\s*(\w+)\s*\)\s*\(/);
  if (fp) return fp[1];
  s = s.replace(/(?:\[[^\]]*\])+$/, '');
  const m = s.match(/(\w+)$/);
  return m ? m[1] : '';
}

const DIRECTIVES_IGNORED = new Set(['include', 'if', 'ifdef', 'ifndef', 'elif', 'else', 'endif', 'undef', 'pragma', 'error', 'warning']);
const COMMENT_OR_STRING = /\/\*[\s\S]*?\*\/|\/\/[^\n]*|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"/g;

/** Parse one preprocessor directive; returns a macro item or null (ignored). */
function parseDirective(raw, prevIfndef, file, line) {
  let trailing = null;
  const stripped = raw.replace(COMMENT_OR_STRING, (m) => {
    if (m.startsWith('/*') || m.startsWith('//')) { if (trailing === null) trailing = commentText(m); return ''; }
    return m;
  });
  const joined = squash(stripped.replace(/\\\r?\n/g, ' '));
  const kind = /^#\s*(\w+)/.exec(joined);
  if (!kind) throw new Error(`${file}:${line}: cannot read preprocessor directive`);
  if (kind[1] !== 'define') {
    if (!DIRECTIVES_IGNORED.has(kind[1])) throw new Error(`${file}:${line}: unsupported preprocessor directive #${kind[1]}`);
    return null;
  }
  const m = /^#\s*define\s+(\w+)(?:\(([^)]*)\))?\s*(.*)$/.exec(joined);
  if (!m) throw new Error(`${file}:${line}: cannot parse #define`);
  const [, name, ps, body] = m;
  // Include guard: an object-like, empty #define right after `#ifndef <same name>`.
  if (ps === undefined && body === '' && prevIfndef === name) return null;
  const params = ps === undefined ? null : ps.split(',').map((s) => s.trim()).filter(Boolean);
  const text = stripped.split('\n').map((l) => l.replace(/\s+$/, '')).join('\n').trim();
  return { kind: 'macro', name, params, text, doc: trailing, line };
}

/**
 * @param {string} text @param {string} file
 * @returns {{file:string,items:(Fn|TypeDecl|Data|Macro|Note)[]}}
 */
export function parseHeader(text, file) {
  text = text.replace(/\r\n/g, '\n');
  const { clean, comments, directives } = scan(text);
  const lineAt = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === '\n') lineAt.push(i + 1);
  const lineOf = (off) => {
    let lo = 0, hi = lineAt.length - 1;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (lineAt[mid] <= off) lo = mid; else hi = mid - 1; }
    return lo + 1;
  };

  const stmts = statements(clean);
  const decls = []; // {pos, item, start, end} lines; source order

  for (const s of stmts) {
    const line = lineOf(s.start);
    const code = clean.slice(s.start, s.end);
    let item = null;
    if (/^SIG_PUBLIC\b/.test(code)) {
      if (s.open) throw new Error(`${file}:${line}: unterminated SIG_PUBLIC declaration`);
      item = parseFunction(code, file, line);
      item.doc = null;
    } else if (/^SIG_PRIVATE\b/.test(code)) {
      item = null; // internal (hidden-visibility) declaration: not API, and its comment is dropped with it
    } else if (/\bSIG_PUBLIC\b/.test(code)) {
      throw new Error(`${file}:${line}: SIG_PUBLIC must start the declaration`);
    } else if (/^typedef\b/.test(code) || /^(?:struct|enum|union)\b/.test(code)) {
      if (s.open) throw new Error(`${file}:${line}: unterminated declaration`);
      const name = typeName(code);
      if (!name && /^typedef\b/.test(code)) throw new Error(`${file}:${line}: cannot find the name of a typedef`);
      item = { kind: 'type', name, text: text.slice(s.start, s.end).trim(), doc: null, line };
    } else if (/^extern\b/.test(code) && !s.open && !/^extern\s*"/.test(code)) {
      const name = typeName(code);
      if (!name) throw new Error(`${file}:${line}: cannot find the name of an extern declaration`);
      const src = text.slice(s.start, s.end).trim();
      item = { kind: 'data', name, type: squash(src.replace(/^extern\s+/, '').replace(/;\s*$/, '')), text: squash(src), doc: null, line };
    } else {
      throw new Error(`${file}:${line}: unrecognised declaration: ${squash(code).slice(0, 60)}`);
    }
    decls.push({ pos: s.start, item, start: line, end: lineOf(s.end - 1) });
  }

  let prevIfndef = null;
  for (const d of directives) {
    const line = lineOf(d.start);
    const raw = text.slice(d.start, d.end);
    const it = parseDirective(raw, prevIfndef, file, line);
    const nm = /^#\s*ifndef\s+(\w+)/.exec(raw);
    prevIfndef = nm ? nm[1] : (/^#\s*define\b/.test(raw) || /^#\s*(?:if|ifdef|else|elif|endif)/.test(raw) ? null : prevIfndef);
    if (it) decls.push({ pos: d.start, item: it, start: line, end: lineOf(d.end - 1) });
  }
  decls.sort((a, b) => a.pos - b.pos);

  const entries = decls.filter((d) => d.item).map((d) => ({ pos: d.pos, item: d.item }));
  const byStart = new Map(decls.map((d) => [d.start, d]));
  const spans = stmts.map((s) => [s.start, s.end]);

  // Standalone comments; consecutive `//` lines form one comment.
  const standalone = [];
  for (const c of comments) {
    if (spans.some(([a, b]) => c.start >= a && c.start < b)) continue; // inside a declaration
    const ls = text.lastIndexOf('\n', c.start - 1) + 1;
    if (text.slice(ls, c.start).trim() !== '') continue; // trailing comment on a code line
    const first = lineOf(c.start);
    const last = lineOf(c.end - 1);
    const prev = standalone[standalone.length - 1];
    if (c.line && prev && prev.line && prev.last + 1 === first) {
      prev.last = last;
      prev.parts.push(commentText(c.text));
    } else standalone.push({ pos: c.start, first, last, line: !!c.line, parts: [commentText(c.text)] });
  }
  for (const c of standalone) {
    const body = c.line ? c.parts.join('\n') : c.parts[0];
    const target = byStart.get(c.last + 1);
    if (target && !target.item) continue;
    if (target && target.item.doc === null) {
      target.item.doc = body;
      // A run of directly adjacent declarations without a comment of their own shares it.
      let prev = target;
      for (let k = decls.indexOf(target) + 1; k < decls.length; k++) {
        const d = decls[k];
        if (!d.item || d.start !== prev.end + 1 || d.item.doc !== null) break;
        d.item.doc = body;
        d.item.docShared = true;
        d.item.docFrom = target.item.name;
        prev = d;
      }
    } else entries.push({ pos: c.pos, item: { kind: 'note', text: body, line: c.first } });
  }

  entries.sort((a, b) => a.pos - b.pos);
  return { file, items: entries.map((e) => e.item) };
}
