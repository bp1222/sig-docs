# sig-docs

The built libsig architecture site, published at <https://bp1222.github.io/sig-docs/>.

This repository holds output only. Do not edit `site/` by hand: the model, the
generator and the build live in bp1222/sig (`tools/architecture`,
`tools/sigdoc`), and `tools/architecture/publish.sh` there rebuilds `site/`
and pushes it here. Pushes to `master` deploy `site/` to GitHub Pages
(Settings -> Pages -> Source: GitHub Actions).
