import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generate, declaredIds } from '../generate.mjs';
import { sigRoot } from './root.mjs';

const HDR = `#pragma once
/* threading: call only from the owner thread */
/** A <tagged> & queued thing. */
typedef struct sig_item { int x; } sig_item;
/** Enqueue <x> & go.
 * @param a the value */
SIG_PUBLIC int sig_service_enqueue(const sig_item *a, int b);

/* second note */

SIG_PUBLIC int sig_service_other(int a);
`;

function fixture() {
  const repo = mkdtempSync(join(tmpdir(), 'sigdoc-repo-'));
  mkdirSync(join(repo, 'include/sig/runtime'), { recursive: true });
  writeFileSync(join(repo, 'include/sig/runtime/sig_service.h'), HDR);
  const out = mkdtempSync(join(tmpdir(), 'sigdoc-out-'));
  mkdirSync(join(out, 'model'));
  const opts = {
    headerArea: { 'include/sig/runtime/sig_service.h': 'service' },
    components: { service: { 'sig.service.queue': ['sig_service_enqueue'], 'sig.service.other': ['sig_service_other'] } },
    declared: new Set(['sig', 'sig.service', 'sig.service.queue', 'sig.service.other']),
  };
  return { repo, out, opts };
}

test('escapes <, > and & in signatures and docs', () => {
  const { repo, out, opts } = fixture();
  generate(repo, out, opts);
  const html = readFileSync(join(out, 'reference/sig_service.html'), 'utf8');
  assert.match(html, /A &lt;tagged&gt; &amp; queued thing/);
  assert.match(html, /Enqueue &lt;x&gt; &amp; go/);
  assert.doesNotMatch(html, /<tagged>/);
  assert.match(html, /<title>[^<]*sig_service/);
});

test('renders notes in source order between declarations', () => {
  const { repo, out, opts } = fixture();
  generate(repo, out, opts);
  const html = readFileSync(join(out, 'reference/sig_service.html'), 'utf8');
  const at = (s) => { const i = html.indexOf(s); assert.ok(i >= 0, s); return i; };
  assert.ok(at('threading: call only') < at('sig_item'));
  assert.ok(at('sig_item') < at('sig_service_enqueue('));
  assert.ok(at('sig_service_enqueue(') < at('second note'));
  assert.ok(at('second note') < at('sig_service_other('));
  const idx = readFileSync(join(out, 'reference/index.html'), 'utf8');
  assert.match(idx, /service/);
  assert.match(idx, /href="sig_service\.html"/);
});

test('emits one extend block per component with its functions', () => {
  const { repo, out, opts } = fixture();
  generate(repo, out, opts);
  const c4 = readFileSync(join(out, 'model/generated.c4'), 'utf8');
  assert.equal((c4.match(/^\s*extend sig\.service\.\w+ /gm) ?? []).length, 2);
  assert.match(c4, /extend sig\.service\.queue \{[^}]*functions 'sig_service_enqueue'/s);
  assert.match(c4, /extend sig\.service\.other \{[^}]*functions 'sig_service_other'/s);
});

test('links under the /sig-docs/ base path in the model fragment', () => {
  const { repo, out, opts } = fixture();
  generate(repo, out, opts);
  const c4 = readFileSync(join(out, 'model/generated.c4'), 'utf8');
  assert.match(c4, /link \/sig-docs\/reference\/sig_service\.html/);
  assert.doesNotMatch(c4, /link \.\./);
});

test('undeclared component ids throw, all named at once', () => {
  const { repo, out, opts } = fixture();
  assert.throws(
    () => generate(repo, out, { ...opts, declared: new Set(['sig', 'sig.service']) }),
    (e) => e.message.includes('sig.service.queue') && e.message.includes('sig.service.other'),
  );
});

test('an undeclared area module throws', () => {
  const { repo, out, opts } = fixture();
  assert.throws(
    () => generate(repo, out, { ...opts, declared: new Set(['sig', 'sig.service.queue', 'sig.service.other']) }),
    (e) => /sig\.service\b(?!\.)/.test(e.message),
  );
});

test('links every header from its module and the reference index from the system', () => {
  const { repo, out, opts } = fixture();
  generate(repo, out, opts);
  const c4 = readFileSync(join(out, 'model/generated.c4'), 'utf8');
  assert.match(c4, /extend sig \{\s*link \/sig-docs\/reference\/index\.html 'API reference/);
  assert.match(c4, /extend sig\.service \{\s*link \/sig-docs\/reference\/sig_service\.html 'sig_service\.h'/);
});

test('every generated reference page is linked from the emitted model fragment', () => {
  const { repo, out, opts } = fixture();
  writeFileSync(join(repo, 'include/sig/runtime/sig_types.h'), 'typedef int sig_t;\n');
  generate(repo, out, { ...opts, headerArea: { ...opts.headerArea, 'include/sig/runtime/sig_types.h': 'service' } });
  const c4 = readFileSync(join(out, 'model/generated.c4'), 'utf8');
  const pages = readdirSync(join(out, 'reference'));
  assert.ok(pages.includes('sig_types.html') && pages.includes('index.html'));
  for (const f of pages) assert.ok(c4.includes(`/sig-docs/reference/${f} '`), f);
});

test('the real tree: every reference page is linked from the model fragment', () => {
  const root = sigRoot;
  const out = mkdtempSync(join(tmpdir(), 'sigdoc-real-'));
  mkdirSync(join(out, 'model'));
  generate(root, out, { declared: declaredIds(join(import.meta.dirname, '..', '..', '..', 'model')) });
  const c4 = readFileSync(join(out, 'model/generated.c4'), 'utf8');
  const pages = readdirSync(join(out, 'reference'));
  assert.ok(pages.length > 30);
  for (const f of pages) assert.ok(c4.includes(`/sig-docs/reference/${f} '`), f);
  const capsule = readFileSync(join(out, 'reference/sig_capsule.html'), 'utf8');
  assert.match(capsule, /SIG_PROP_INT/);
  const rt = readFileSync(join(out, 'reference/sig_runtime.html'), 'utf8');
  const stop = rt.slice(rt.indexOf('id="sig_runtime_service_stop"'));
  assert.match(stop.slice(0, stop.indexOf('</section>')), /from a service or capsule thread/);
  assert.match(readFileSync(join(out, 'reference/sig_persistence_file.html'), 'utf8'), /sig_persistence_file_module/);
  for (const f of pages) {
    const ids = [...readFileSync(join(out, 'reference', f), 'utf8').matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length, `duplicate ids in ${f}`);
  }
});

test('renders macros, extern data, shared-doc labels, a back link, and unique ids', () => {
  const { repo, out, opts } = fixture();
  writeFileSync(join(repo, 'include/sig/runtime/sig_service.h'), `#ifdef X
#define LIM 1
#else
#define LIM 2
#endif
extern const int sig_service_data;
/** Stop <it>. */
SIG_PUBLIC int sig_service_enqueue(int a);
SIG_PUBLIC int sig_service_other(int a);
`);
  generate(repo, out, opts);
  const html = readFileSync(join(out, 'reference/sig_service.html'), 'utf8');
  assert.match(html, /id="macro-LIM"/);
  assert.match(html, /id="macro-LIM-2"/);
  assert.match(html, /extern const int sig_service_data;/);
  assert.match(html, /shared with <a href="#sig_service_enqueue">sig_service_enqueue<\/a>/);
  assert.match(html, /href="\/sig-docs\/"/);
});

test('stale reference pages are removed', () => {
  const { repo, out, opts } = fixture();
  mkdirSync(join(out, 'reference'));
  writeFileSync(join(out, 'reference/old.html'), 'x');
  generate(repo, out, opts);
  assert.ok(!existsSync(join(out, 'reference/old.html')));
});

test('declaredIds finds dotted element paths, ignoring comments and generated.c4', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sigdoc-model-'));
  writeFileSync(join(dir, 'a.c4'), `
specification { element system }
model {
  sig = system 'sig' {
    // old = component 'x'
    service = container 'service' {
      queue = component 'queue' { metadata { a 'b' } }
      leaf = component 'leaf'
    }
  }
}
views { view v { include sig.* } }
`);
  writeFileSync(join(dir, 'generated.c4'), `model { extend sig { ghost = component 'g' } }`);
  const ids = declaredIds(dir);
  assert.deepEqual([...ids].sort(), ['sig', 'sig.service', 'sig.service.leaf', 'sig.service.queue']);
});

test('declaredIds: // inside a string does not hide later declarations', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sigdoc-model-'));
  writeFileSync(join(dir, 'a.c4'), `
model {
  sig = system 'sig' {
    a = component 'a' { link 'https://example.com/x' }
    b = component "b // not a comment"
    /* gone = component 'g' */
    // hidden = component 'h'
    c = component 'it\\'s // fine'
    d = component 'd'
  }
}
`);
  assert.deepEqual([...declaredIds(dir)].sort(), ['sig', 'sig.a', 'sig.b', 'sig.c', 'sig.d']);
});

test('declaredIds: extend bodies contribute the extended path as prefix', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sigdoc-model-'));
  writeFileSync(join(dir, 'a.c4'), `
model {
  sig = system 'sig'
}
`);
  writeFileSync(join(dir, 'b.c4'), `
model {
  extend sig {
    platform = module 'Platform' {
      threads = component 'Threads' { description 'x' }
    }
  }
  extend sig.platform {
    time = component 'Time'
  }
}
views { view v { extend sig { bogus = component 'no' } } }
`);
  assert.deepEqual([...declaredIds(dir)].sort(),
    ['sig', 'sig.platform', 'sig.platform.threads', 'sig.platform.time']);
});
