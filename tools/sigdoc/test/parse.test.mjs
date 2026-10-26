import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { parseHeader } from '../parse.mjs';
import { sigRoot } from './root.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = (n) => readFileSync(join(here, 'fixtures', n), 'utf8');
const fns = (r) => r.items.filter((i) => i.kind === 'function');

test('parses a simple function with its adjacent doc', () => {
  const r = parseHeader(fixture('simple.h'), 'simple.h');
  const f = fns(r)[0];
  assert.equal(f.name, 'sig_service_name');
  assert.equal(f.returns, 'const char *');
  assert.deepEqual(f.params, [{ type: 'const sig_service *', name: 'svc' }]);
  assert.match(f.doc, /Read-only/);
  assert.equal(f.signature, 'const char * sig_service_name(const sig_service * svc)');
  assert.equal(f.line, 10);
  assert.deepEqual(fns(r)[1].params, []);
  assert.equal(fns(r)[1].doc, null);
});

test('keeps multi-line parameters with a function pointer whole', () => {
  const r = parseHeader(fixture('multiline.h'), 'multiline.h');
  const [wait, walk, put] = fns(r);
  assert.equal(wait.name, 'sig_poller_wait');
  assert.equal(wait.params.length, 5);
  assert.deepEqual(wait.params[4], { type: 'size_t *', name: 'out_n' });
  assert.equal(walk.params.length, 4);
  assert.deepEqual(walk.params[1], { type: 'void (*)(void *ctx, const char *name)', name: 'cb' });
  assert.match(walk.doc, /Walks every item/);
  assert.equal(put.name, 'sig_mgmt_put_configuration');
  assert.equal(put.params.length, 8);
  assert.equal(put.line, 11);
});

test('ignores SIG_PUBLIC inside comments and strings', () => {
  const r = parseHeader(fixture('ignored.h'), 'ignored.h');
  assert.equal(fns(r).length, 0);
});

test('keeps a detached block comment as a note', () => {
  const r = parseHeader(fixture('detached.h'), 'detached.h');
  assert.equal(r.items[0].kind, 'note');
  assert.match(r.items[0].text, /Threading contract/);
  assert.equal(r.items[1].kind, 'type');
  assert.equal(r.items[1].doc, null);
  assert.equal(r.items[2].kind, 'function');
});

test('returns types and no functions for a header without SIG_PUBLIC', () => {
  const r = parseHeader(fixture('types_only.h'), 'types_only.h');
  assert.equal(fns(r).length, 0);
  const types = r.items.filter((i) => i.kind === 'type');
  assert.deepEqual(types.map((t) => t.name), ['sig_tap_direction', 'sig_tap_fn']);
  assert.match(types[0].doc, /A tap observes/);
});

test('throws file:line on an unreadable SIG_PUBLIC declaration', () => {
  assert.throws(() => parseHeader(fixture('bad.h'), 'bad.h'), /^Error: bad\.h:3:/);
});

test('parses every real public header; function count matches SIG_PUBLIC declarations', () => {
  const root = sigRoot;
  const walk = (d) => readdirSync(d).flatMap((n) => {
    const p = join(d, n);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.h') ? [p] : [];
  });
  const files = [...walk(join(root, 'include')), ...walk(join(root, 'host', 'include'))];
  assert.ok(files.length > 0);
  let parsed = 0, expected = 0;
  for (const f of files) {
    const text = readFileSync(f, 'utf8');
    parsed += fns(parseHeader(text, f)).length;
    // Independent count: every SIG_PUBLIC token outside comments, strings and #define lines.
    const code = text
      .replace(/\/\*[\s\S]*?\*\/|\/\/[^\n]*|"(?:[^"\\\n]|\\.)*"/g, ' ')
      .replace(/^[ \t]*#[ \t]*define\b(?:[^\n]*\\\n)*[^\n]*/gm, ' ');
    expected += (code.match(/\bSIG_PUBLIC\b/g) ?? []).length;
  }
  assert.equal(parsed, expected);
  assert.ok(parsed > 200);
});

test('names struct/enum typedefs by their declarator, not a function-pointer member', () => {
  const r = parseHeader(fixture('fnptr_members.h'), 'fnptr_members.h');
  assert.deepEqual(r.items.map((i) => i.name), ['vt', 'sig_ops', 'sig_kind', 'sig_tagged', 'sig_tap_fn']);
});

const items = (src, kind) => parseHeader(src, 't.h').items.filter((i) => !kind || i.kind === kind);

test('renders extern data declarations as data items', () => {
  const [d] = items('/* The module. */\nextern const sig_module sig_x_module;\n', 'data');
  assert.equal(d.name, 'sig_x_module');
  assert.equal(d.type, 'const sig_module sig_x_module');
  assert.equal(d.text, 'extern const sig_module sig_x_module;');
  assert.equal(d.doc, 'The module.');
  assert.equal(d.line, 2);
});

test('extern "C" blocks and SIG_PRIVATE declarations are ignored', () => {
  const r = items('#ifdef __cplusplus\nextern "C" {\n#endif\n/* hidden */\nSIG_PRIVATE int x(void);\nSIG_PUBLIC int y(void);\n#ifdef __cplusplus\n}\n#endif\n');
  assert.deepEqual(r.map((i) => i.name ?? i.kind), ['y']);
  assert.equal(r[0].doc, null);
});

test('throws file:line when SIG_PUBLIC does not start the statement', () => {
  assert.throws(() => parseHeader('\nstatic inline SIG_PUBLIC int f(void);\n', 't.h'), /^Error: t\.h:2: SIG_PUBLIC/);
  assert.throws(() => parseHeader('extern SIG_PUBLIC int v;\n', 't.h'), /^Error: t\.h:1:/);
});

test('throws file:line for an unrecognised top-level statement', () => {
  assert.throws(() => parseHeader('\n\nstatic int counter = 3;\n', 't.h'), /^Error: t\.h:3: unrecognised/);
  assert.throws(() => parseHeader('static inline int f(int a) { return a; }\n', 't.h'), /^Error: t\.h:1: unrecognised/);
  assert.throws(() => parseHeader('#warn nope\n', 't.h'), /^Error: t\.h:1: unsupported preprocessor/);
});

test('emits #define items: object-like, function-like, multi-line, trailing comment doc', () => {
  const src = `#ifndef T_H
#define T_H
#define LIMIT 16 /* max things */
/** Make a thing. */
#define MK(a, b) \\
    { .a = (a), \\
      .b = (b) }
#define EMPTY
#endif
`;
  const m = items(src, 'macro');
  assert.deepEqual(m.map((x) => x.name), ['LIMIT', 'MK', 'EMPTY']);
  assert.equal(m[0].params, null);
  assert.equal(m[0].doc, 'max things');
  assert.equal(m[0].text, '#define LIMIT 16');
  assert.deepEqual(m[1].params, ['a', 'b']);
  assert.equal(m[1].doc, 'Make a thing.');
  assert.equal(m[1].line, 5);
  assert.match(m[1].text, /\.b = \(b\) \}$/);
  assert.equal(m[2].text, '#define EMPTY');
});

test('include guards are excluded; only an empty #define right after #ifndef of the same name', () => {
  assert.equal(items('#ifndef A_H\n#define A_H\n#endif\n', 'macro').length, 0);
  assert.equal(items('#ifndef A_H\n#define B_H\n#endif\n', 'macro').length, 1);
  assert.equal(items('#ifndef A\n#define A 1\n#endif\n', 'macro').length, 1);
  assert.equal(items('#define A_H\n', 'macro').length, 1);
});

test('macros in both #if branches are emitted', () => {
  const m = items('#ifdef X\n#define P 1\n#else\n#define P 2\n#endif\n', 'macro');
  assert.deepEqual(m.map((x) => x.text), ['#define P 1', '#define P 2']);
});

test('the capsule property macros are in the real sig_capsule.h', () => {
  const root = sigRoot;
  const f = 'include/sig/runtime/sig_capsule.h';
  const names = items(readFileSync(join(root, f), 'utf8'), 'macro').map((x) => x.name);
  for (const n of ['SIG_PROP_INT', 'SIG_PROP_STRING_CHOICES', 'SIG_TERMINAL_DEFAULT']) assert.ok(names.includes(n), n);
});

test('a comment is shared by a run of directly adjacent declarations; a blank line ends the run', () => {
  const src = `/* Stop it. Never call from a worker. */
SIG_PUBLIC int a_stop(void);
SIG_PUBLIC int a_restart(void);
SIG_PUBLIC int a_third(void);

SIG_PUBLIC int a_after_blank(void);
/* Own doc. */
SIG_PUBLIC int b_own(void);
SIG_PUBLIC int b_next(void);
`;
  const [a, b, c, d, e, f] = items(src);
  assert.equal(a.docShared, undefined);
  assert.equal(a.doc, 'Stop it. Never call from a worker.');
  for (const x of [b, c]) { assert.equal(x.doc, a.doc); assert.equal(x.docShared, true); assert.equal(x.docFrom, 'a_stop'); }
  assert.equal(d.doc, null);
  assert.equal(e.doc, 'Own doc.');
  assert.equal(f.docFrom, 'b_own');
});

test('a declaration with a comment of its own does not join the run', () => {
  const src = `/* One. */
SIG_PUBLIC int a(void);
/* Two. */
SIG_PUBLIC int b(void);
`;
  const [a, b] = items(src);
  assert.equal(a.doc, 'One.');
  assert.equal(b.doc, 'Two.');
  assert.equal(b.docShared, undefined);
});

test('consecutive // lines form one doc comment', () => {
  const src = `// First line.
// Second line.
SIG_PUBLIC int a(void);
SIG_PUBLIC int b(void); // trailing, not a doc

// Detached.

// Another run
SIG_PUBLIC int c(void);
`;
  const r = items(src);
  assert.equal(r[0].doc, 'First line.\nSecond line.');
  assert.equal(r[1].docShared, true);
  assert.equal(r.find((i) => i.name === 'c').doc, 'Another run');
  assert.equal(r.filter((i) => i.kind === 'note').length, 1);
});

test('on the real tree, grouped declarations carry the shared contract', () => {
  const root = sigRoot;
  const f = 'include/sig/runtime/sig_runtime.h';
  const stop = items(readFileSync(join(root, f), 'utf8'), 'function').find((x) => x.name === 'sig_runtime_service_stop');
  assert.match(stop.doc, /Do NOT call sig_runtime_service_\* .*from a service or capsule thread/s);
});
