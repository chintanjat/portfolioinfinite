# Chintan Jat — Infinite Canvas Portfolio

An interactive, pan-and-zoom "infinite canvas" portfolio. Open `index.html`
in a browser — that's the whole site.

## Files

| File | Role |
|------|------|
| **index.html** | The built, self-contained site. This is what you deploy/open. |
| `styles.css` | Source: all styling. |
| `data.jsx` | Source: portfolio content + canvas island layout. |
| `components.jsx` | Source: presentational React components. |
| `app.jsx` | Source: canvas engine (pan / zoom / minimap / chrome) + mount. |
| `build.mjs` | Regenerates `index.html` from the source files above. |
| `uploads/` | Images and the résumé PDF used by the site. |

`index.html` is generated — it inlines minified CSS and the JSX (transpiled to
plain JS) and loads **production** React from a CDN. Edit the source files, not
`index.html` directly, then rebuild.

## Rebuilding after editing source

```bash
npm i -D esbuild
node build.mjs
```

## What was optimized

- **Removed in-browser Babel + development React** (~3.9 MB that was downloaded
  and run on every page load). JSX is now transpiled ahead of time and the page
  loads production React (~142 KB) with Subresource Integrity hashes.
- **Minified** the inlined CSS and JS.
- **Deleted unused assets** — screenshots and images not referenced anywhere in
  the code (including uncompressed originals whose `…compressed.jpg` variants are
  the ones actually used), a duplicate résumé PDF, and a generated, unreferenced
  `support.js` runtime.

Every remaining file in `uploads/` is referenced by the site.
