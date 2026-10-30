import { readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)(process.env.PW_PATH || 'playwright');
let html = readFileSync('www/index.html', 'utf8');
html = html.replace(/url\(fonts\/([^)]+)\)/g, (m, f) => `url(data:font/woff2;base64,${readFileSync('www/fonts/' + f).toString('base64')})`);
const js = readFileSync('www/app.js', 'utf8').replace(/<\/script/gi, '<\\/script');
const guard = readFileSync('tools/guard.js', 'utf8');
const mk = (h) => html.replace('<script src="app.js"></script>', () => `<script id="app-src" type="text/plain">${js}</script><script data-h="${h}">${guard}</script>`);
// compute the digest in a real browser using the very same code that will verify it
const tmp = 'www/_guard.html'; writeFileSync(tmp, mk('BUILD'));
const b = await chromium.launch(); const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/' + tmp);
const h = await p.evaluate(() => window.__digest); await b.close();
if (!/^[0-9a-f]{64}$/.test(h)) throw new Error('digest failed');
writeFileSync('MolecularSymmetryLab.html', mk(h));
(await import('node:fs')).unlinkSync(tmp);
console.log('digest', h.slice(0, 12), (readFileSync('MolecularSymmetryLab.html').length / 1024).toFixed(0) + ' KB');
