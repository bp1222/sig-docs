// Explicit header -> area table. An unlisted header is an error (see map.mjs).
const dir = (prefix, area, names) => names.map((n) => [`${prefix}/${n}`, area]);
const P = 'include/sig';

const entries = [
  ...dir(`${P}/runtime`, 'service', ['sig_service.h']),
  ...dir(`${P}/runtime`, 'capsules', ['sig_capsule.h']),
  ...dir(`${P}/runtime`, 'runtime', ['sig_loop.h', 'sig_runtime.h', 'sig_tap.h']),
  ...dir(`${P}/project`, 'project', ['sig_config.h', 'sig_project.h']),
  ...dir(`${P}/http`, 'http', ['sig_http_client.h', 'sig_http_server.h', 'sig_ws.h']),
  ...dir(`${P}/mgmt`, 'mgmt', ['sig_mgmt.h', 'sig_mgmt_http.h']),
  ...dir(`${P}/persistence`, 'persistence', ['sig_persistence.h', 'sig_persistence_file.h']),
  ...dir(`${P}/net`, 'platform', ['sig_net.h']),
  ...dir(`${P}/platform`, 'platform', ['sig_poller.h', 'sig_thread.h', 'sig_time.h']),
  ...dir(`${P}/feed`, 'feed', ['sig_signal_feed.h']),
  ...dir(`${P}/base`, 'foundation', [
    'sig_alloc.h', 'sig_atomic.h', 'sig_ht.h', 'sig_ll.h', 'sig_log.h',
    'sig_portability.h', 'sig_status.h',
  ]),
  ...dir(`${P}/value`, 'foundation', [
    'sig_expr.h', 'sig_json.h', 'sig_value.h', 'sig_value_json.h', 'sig_value_python.h',
  ]),
  ['host/include/sig/sig_host.h', 'host'],
];

export const AREAS = [
  'runtime', 'service', 'project', 'capsules', 'http', 'mgmt',
  'persistence', 'platform', 'feed', 'foundation', 'host',
];

/** header path (repo-relative, forward slashes) -> area id */
export const HEADER_AREA = Object.freeze(Object.fromEntries(entries));
