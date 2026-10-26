# libsig architecture site

An explorable [C4](https://c4model.com) model of libsig, built with
[LikeC4](https://likec4.dev). Published at <https://bp1222.github.io/sig-docs/>
(CI builds it on every pull request and deploys it from `master`).

This repository is a submodule of [bp1222/sig](https://github.com/bp1222/sig)
at `docs/architecture`. The generator reads that repository's public headers,
so it needs the parent checkout: as a submodule it finds it at `../..`; for a
standalone clone set `SIG_ROOT` to a checkout of bp1222/sig.

It complements, and does not replace, `docs/architecture.md` in bp1222/sig:
that document explains the concepts; this site lets you click through the
containers, modules and components, the dynamic (runtime) views, and a
per-header function reference.

## Running it

Requirements: Node >= 22.22.3 (likec4 1.60.0's engine requirement; CI uses
22.22.3) and pnpm 12 (the lockfile is written by pnpm 12.6.0).

```sh
pnpm install
pnpm dev      # runs the generator, then a live-reloading dev server
pnpm build    # writes dist
```

`build` runs the generator (`pnpm run gen`), validates the model with
`likec4 validate model` (an invalid model, such as a dangling reference, fails
the build; `likec4 build` alone would still exit 0), clears `dist/`, builds the
LikeC4 site with base path `/sig-docs/` and hash-based routing (see below), then
copies the generated `reference/` pages into `dist/reference/`.

The reference pages are plain HTML served from `/sig-docs/reference/`; the dev
server does not serve them, so their links 404 there. To preview them, run
`pnpm build`, then serve `dist` under a `/sig-docs/` prefix (for example, copy or
link `dist` to `/tmp/site/sig-docs` and run `python3 -m http.server -d /tmp/site`,
then open `http://localhost:8000/sig-docs/`). The tests for the generator are
`SIG_ROOT=<sig checkout> node --test tools/sigdoc/test/` (SIG_ROOT defaults to `../..`).

Routing uses the URL hash (`/sig-docs/#/view/index`) because GitHub Pages is a
static host: it answers 404 for client-side paths such as `/sig-docs/view/index/`
and for a reload on them. Hash URLs always load `/sig-docs/`.

## Structure

- `model/*.c4` is hand-written: one file per area (`foundation`, `runtime`,
  `service`, `capsules`, `http`, ...), plus `specification.c4` (element kinds),
  `context.c4` and `relationships.c4` (cross-area edges).
- `tools/sigdoc/` generates, from the public headers, two things that are
  git-ignored: `reference/*.html` (one page per header) and
  `model/generated.c4` (the function-level data the model links to). Do not
  edit them. The generator deletes and rewrites `reference/` on every run.
- `dist/` is the build output and is also ignored.

## Updating the site

**Add a header.** Add it to the table in `tools/sigdoc/areas.mjs` with its
area. An unlisted header is a build error.

**Generated pages.** The reference shows functions, types, `extern` data
declarations and `#define` macros (include guards are skipped; `#if` branches
show both definitions). A comment above a run of adjacent declarations is
shown on each, labelled "shared with <first>"; a blank line ends the run. The
parser fails with `file:line` on a statement it does not recognise or on a
`SIG_PUBLIC` that does not start its declaration; `SIG_PRIVATE` declarations
are skipped on purpose.

**Component ids must exist.** Every id in `tools/sigdoc/components.json` and
every area module (`sig.<area>`) must be declared in `model/*.c4`; otherwise
the generator throws and lists them all. Every header page is linked from its
module, and the index from the `sig` system.

**Add a function.** Every `SIG_PUBLIC` function must match a component of its
header's area in `tools/sigdoc/components.json`. Components map to exact names
or patterns (`sig_runtime_service_*`). If a function matches nothing, the
build fails and names it. Add it to an existing component, or add a component.

**Add a component or module.** Use dotted ids (`sig.runtime.tap`) and extend
the parent in the area's `.c4` file. Each area has views named `<area>` and
`<area>_components`; add new elements to those so they show up. Start the file
with the source comment convention: a header comment listing the sources
(`file:lines  what it supports`) that every statement in the file was checked
against.

**Verify every statement against the code.** The model must not assert
anything that has not been checked in the source or headers. Where
`docs/architecture.md` (in bp1222/sig) and the code disagree, the code wins; record the
disagreement rather than copying the doc.

## Publishing

The workflow `.github/workflows/architecture-site.yml` runs the sigdoc tests
and the build on pull requests, and deploys to GitHub Pages on pushes to
`master`. GitHub Pages must be switched on once: Settings -> Pages -> Source:
GitHub Actions. The workflow checks out bp1222/sig for the headers; if that
repository is private, add a read-only token as the `SIG_READ_TOKEN` secret.
