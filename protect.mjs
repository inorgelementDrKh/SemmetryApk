// Usage: node protect.mjs "<password>" [in.html] [out.html]
import { readFileSync, writeFileSync } from 'node:fs';
import { webcrypto as C } from 'node:crypto';
import { deflateSync } from 'node:zlib';
const [pw, inp = 'MolecularSymmetryLab.html', out = 'MolecularSymmetryLab-Protected.html'] = process.argv.slice(2);
if (!pw || pw.length < 8) { console.error('Give a password of at least 8 characters'); process.exit(1); }
const ITER = 600000;
const salt = C.getRandomValues(new Uint8Array(16)), iv = C.getRandomValues(new Uint8Array(12));
const km = await C.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
const key = await C.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: ITER, hash: 'SHA-256' }, km, { name: 'AES-GCM', length: 256 }, false, ['encrypt']);
const plain = deflateSync(readFileSync(inp), { level: 9 });
const ct = new Uint8Array(await C.subtle.encrypt({ name: 'AES-GCM', iv }, key, plain));
const b = (u) => Buffer.from(u).toString('base64');
const payload = JSON.stringify({ s: b(salt), n: b(iv), i: ITER, c: b(ct) });
writeFileSync(out, readFileSync('tools/loader.html', 'utf8').replace('__PAYLOAD__', () => payload));
console.log('wrote', out, (readFileSync(out).length / 1024).toFixed(0) + ' KB');
