import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';
import { buildModelData } from '../map.mjs';
import { sigRoot } from './root.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), 'fixtures', 'repo');
const S = 'include/sig/runtime/sig_service.h';
const H = 'host/include/sig/sig_host.h';
const headerArea = { [S]: 'service', [H]: 'host' };
const components = {
  service: { enq: ['sig_service_enqueue'], sched: ['sig_service_schedule_*'] },
  host: { 'host-all': ['*'] },
};

test('maps every header to one area', () => {
  const m = buildModelData(root, { headerArea, components });
  assert.deepEqual([...m.areas.keys()].sort(), ['host', 'service']);
  assert.deepEqual(m.areas.get('service').headers, [S]);
  assert.equal(m.areas.get('service').functions.length, 2);
  assert.deepEqual(m.components.get('enq').map((f) => f.name), ['sig_service_enqueue']);
});

test('fails naming a header with no entry', () => {
  assert.throws(
    () => buildModelData(root, { headerArea: { [S]: 'service' }, components }),
    (e) => e.message.includes(H),
  );
});

test('fails naming a function that matches no component', () => {
  assert.throws(
    () => buildModelData(root, { headerArea, components: { ...components, service: { enq: ['sig_service_enqueue'] } } }),
    (e) => e.message.includes('sig_service_schedule_at') && !e.message.includes('sig_service_enqueue'),
  );
});

test('a function may belong to two components', () => {
  const c = { ...components, service: { ...components.service, both: ['sig_service_*'] } };
  const m = buildModelData(root, { headerArea, components: c });
  assert.ok(m.components.get('both').some((f) => f.name === 'sig_service_enqueue'));
  assert.ok(m.components.get('enq').some((f) => f.name === 'sig_service_enqueue'));
});

test('the real tree maps completely', () => {
  buildModelData(sigRoot);
});

test('a wrong repo root fails clearly instead of producing an empty map', () => {
  assert.throws(() => buildModelData(join(root, 'nowhere'), { headerArea, components }), /cannot read/);
  assert.throws(() => buildModelData(join(root, 'repo', 'host'), { headerArea, components }), /cannot read/);
});
