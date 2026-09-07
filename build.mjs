/*
 * build.mjs — regenerate the optimized, self-contained index.html from source.
 *
 * The site's source lives in four readable files:
 *   styles.css      — all styling
 *   data.jsx        — portfolio content + canvas island layout
 *   components.jsx  — presentational React components
 *   app.jsx         — canvas engine (pan / zoom / minimap / chrome) + mount
 *
 * This script transpiles the JSX to plain JS, minifies JS + CSS, and inlines
 * everything into a single index.html that loads *production* React from a CDN.
 * No Babel or JSX transform runs in the browser (the old build shipped
 * ~2.9 MB of @babel/standalone + ~1 MB of development React and transpiled
 * on every page load — all of that is now gone).
 *
 * Usage:
 *   npm i -D esbuild
 *   node build.mjs
 *
 * Only needed if you edit the source files above; the committed index.html is
 * already built.
 */
import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';

const REACT_VERSION = '18.3.1';
// SRI hashes for the pinned production UMD builds on unpkg (react@18.3.1).
const SRI = {
  react: 'sha384-DGyLxAyjq0f9SPpVevD6IgztCFlnMF6oW/XQGmfe+IsZ8TqEiDrcHkMLKI6fiB/Z',
  reactDom: 'sha384-gTGxhz21lVGYNMcdJOyq01Edg0jhn/c22nsx0kyqP0TxaV5WVdsSH1fSDUf5YJj1',
};

async function transform(file) {
  const res = await build({
    entryPoints: [file],
    write: false,
    bundle: false,
    minify: true,
    target: ['es2018'],
    loader: { '.jsx': 'jsx', '.css': 'css' },
  });
  return res.outputFiles[0].text.trimEnd();
}

const [css, data, components, app] = await Promise.all([
  transform('styles.css'),
  transform('data.jsx'),
  transform('components.jsx'),
  transform('app.jsx'),
]);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Chintan Jat — Infinite Canvas</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<template id="__bundler_thumbnail" data-bg-color="#eef2f6">
  <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="800" fill="#eef2f6"/>
    <circle cx="600" cy="330" r="9" fill="#3f8f6b"/>
    <text x="600" y="470" font-family="Georgia, serif" font-size="130" font-style="italic" fill="#1e2b3a" text-anchor="middle">CJ</text>
    <text x="600" y="560" font-family="monospace" font-size="30" letter-spacing="6" fill="#5a6b7d" text-anchor="middle">INFINITE CANVAS</text>
  </svg>
</template>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://unpkg.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${css}
</style>
</head>
<body>
<div id="root"></div>

<script src="https://unpkg.com/react@${REACT_VERSION}/umd/react.production.min.js" integrity="${SRI.react}" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@${REACT_VERSION}/umd/react-dom.production.min.js" integrity="${SRI.reactDom}" crossorigin="anonymous"></script>

<script>
${data}
</script>
<script>
${components}
</script>
<script>
${app}
</script>
</body>
</html>
`;

await writeFile('index.html', html);
console.log('Wrote index.html (' + html.length + ' bytes)');
