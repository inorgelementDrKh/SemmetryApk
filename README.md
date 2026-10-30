# Molecular Symmetry Lab

Interactive Android app (Capacitor + three.js) for learning molecular symmetry.
Devised by Dr. Alireza Khorshidi, University of Guilan.

- 45 molecules in 3D covering 30 point groups (C1, Cs, Ci, C2, C3, S4, S6, C2v–C5v, C∞v, C2h, C3h, D2–D6h, D∞h, D2d–D5d, Td, Th, Oh, Ih)
- English and Persian (right-to-left) with a one-tap language switch
- Every symmetry element is found numerically from the coordinates: E, Cn, σ (h, v, d), i and **improper axes Sn**
- Each operation can be played atom by atom (the Sn animation does rotate-then-reflect)
- Deduce tab: step-by-step point-group flowchart, built from the molecule's real elements
- Quiz tab, Learn tab (operations, Sn explanation, point-group cheat sheet)
- Opening animation of the author's name

## Build the APK

Needs Node 20+, JDK 21 and the Android SDK (platform 36, build-tools 36).

    npm ci
    npm test            # checks all 45 point groups
    npm run apk         # -> android/app/build/outputs/apk/debug/app-debug.apk

No local SDK? Push this folder to a GitHub repository. The workflow in
`.github/workflows/apk.yml` builds the APK and attaches it as a download.

Copy the APK to the phone and open it. Android will ask to allow installs
from your file manager or browser the first time.

## Password-protected HTML
`node build-single.mjs && node protect.mjs "<password>"` writes `MolecularSymmetryLab-Protected.html` (AES-256-GCM, PBKDF2-SHA256 600 000 rounds; any modification of the file makes decryption fail). Change the password with `tools/ChangePassword.html`. Never store the password in this project.

## Tamper check (single-file HTML)
`node build-single.mjs` embeds a SHA-256 digest of the styles, markup, app code and guard. If any part is edited, or the guard is removed, the page shows a "modified copy" message and the app does not start. This deters casual editing; it cannot stop a determined programmer. The Android build (`www/`) does not use it, because an installed APK is already hard to alter.
