import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Checkout of bp1222/sig whose headers the real-tree tests read. As a
// submodule at docs/architecture it is two levels above the repo root.
export const sigRoot = process.env.SIG_ROOT
  ?? join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..');
