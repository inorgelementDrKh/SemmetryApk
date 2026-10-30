import { build } from 'esbuild';
import { mkdirSync, copyFileSync, readFileSync, writeFileSync, rmSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www/fonts', { recursive: true });

const FONTS = [
  ['cormorant-garamond', 'Cormorant Garamond', 'italic', 600, 'latin'],
  ['ibm-plex-sans', 'IBM Plex Sans', 'normal', 400, 'latin'],
  ['ibm-plex-sans', 'IBM Plex Sans', 'normal', 600, 'latin'],
  ['ibm-plex-sans', 'IBM Plex Sans', 'normal', 400, 'greek'],
  ['ibm-plex-sans', 'IBM Plex Sans', 'normal', 600, 'greek'],
  ['ibm-plex-mono', 'IBM Plex Mono', 'normal', 500, 'latin'],
  ['vazirmatn', 'Vazirmatn', 'normal', 400, 'arabic'], ['vazirmatn', 'Vazirmatn', 'normal', 600, 'arabic'], ['vazirmatn', 'Vazirmatn', 'normal', 700, 'arabic'],
  ['vazirmatn', 'Vazirmatn', 'normal', 400, 'latin'], ['vazirmatn', 'Vazirmatn', 'normal', 600, 'latin'], ['vazirmatn', 'Vazirmatn', 'normal', 700, 'latin'],
];
const ranges = {
  latin: 'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD',
  greek: 'U+0370-03FF',
  arabic: 'U+0600-06FF,U+0750-077F,U+0870-088E,U+0890-0891,U+0898-08E1,U+08E3-08FF,U+200C-200E,U+2010-2011,U+204F,U+2E41,U+FB50-FDFF,U+FE70-FE74,U+FE76-FEFC',
};
let faces = '';
for (const [pkg, fam, style, w, sub] of FONTS) {
  const file = `${pkg}-${sub}-${w}-${style}.woff2`;
  copyFileSync(`node_modules/@fontsource/${pkg}/files/${file}`, `www/fonts/${file}`);
  faces += `@font-face{font-family:"${fam}";font-style:${style};font-weight:${w};font-display:swap;src:url(fonts/${file}) format("woff2");unicode-range:${ranges[sub]}}\n`;
}

await build({ entryPoints: ['src/app.js'], bundle: true, minify: true, format: 'iife', target: 'chrome90', outfile: 'www/app.js', legalComments: 'none' });

const css = readFileSync('src/styles.css', 'utf8');
const body = readFileSync('src/body.html', 'utf8');
writeFileSync('www/index.html', `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no">
<meta name="theme-color" content="#070b14">
<title>Molecular Symmetry Lab</title>
<style>
${faces}${css}
</style>
</head>
<body>
${body}
<script src="app.js"></script>
</body>
</html>
`);
console.log('built www/');
