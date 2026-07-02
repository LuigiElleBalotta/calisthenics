# Calisthenics Website — Developer Rules

## Mandatory libraries

- **Three.js r169** (ES module via importmap da jsdelivr)
- **GSAP 3.12** + ScrollTrigger (global via CDN, caricato prima del modulo)

## File structure

```
index.html   — solo markup HTML, zero <script> inline
style.css    — tutto il CSS, caricato via <link>
app.js       — ES module puro (import * as THREE from 'three')
models/      — file FBX da Mixamo
```

> ⚠️ Non mettere mai commenti HTML `<!-- -->` dentro `<script type="module">` — il browser li rifiuta come errore di sintassi e il modulo non parte.
SC
## Scroll behaviour — desktop vs mobile

Il sito ha due comportamenti completamente distinti a seconda del device.

### Desktop (≥ 768px) — Apple-style scroll-jacking

- Ogni esercizio ha un wrapper `.scroll-scene` con `height: 300vh`
- Il canvas interno è `position: sticky; top: 0; height: 100vh` — rimane fisso mentre si scrolla
- GSAP ScrollTrigger con `scrub: 1` mappa il progresso (0→1) su `mixer.setTime(progress × clipDuration)`
- L'animazione avanza frame-per-frame seguendo lo scroll, può andare anche indietro
- Progress bar verde in basso mostra l'avanzamento
- Testo e gradiente overlay sul lato **destro**; modello 3D visibile sul lato **sinistro**

### Mobile (< 768px) — loop autonomo

- Il wrapper `.scroll-scene` ha altezza automatica (niente `300vh`)
- Il canvas è `position: relative; height: 72vw; min-height: 280px`
- L'animazione gira **in loop automatico** — nessuno scroll-jacking
- `position: sticky` non è affidabile su Safari iOS con contenitori grandi
- `.ex-divider` è nascosto (`display: none`)
- `.scene-progress` e `.scene-hint` sono nascosti
- La descrizione del circuito mostra testo diverso: classe `.mobile-only` / `.desktop-only`

## Layout conventions

- `.desktop-only` → `display: none` sotto 767px
- `.mobile-only`  → `display: none` sopra 768px
- Descrizioni e tips degli esercizi sono nascosti su mobile (solo titolo, tag, bottone)
- Il gradiente overlay va da destra (opaco) verso sinistra (trasparente) — mai coprire il modello 3D

## 3D Models

Fonte principale: **Mixamo** (https://www.mixamo.com)  
Formato: FBX Binary, With Skin, 30fps, keyframe reduction: none

| Modello | Usato per |
|---------|-----------|
| Air Squat.fbx | Squat |
| Push Up.fbx | Push-up sulle ginocchia |
| Plank.fbx | Plank |
| Crouching.fbx | Affondi (Lunge) |
| Situps.fbx | Superman |
| Burpee.fbx | Glute Bridge |
| Arm Stretching.fbx | Riscaldamento braccia |
| Twist Dance.fbx | Riscaldamento anche |
| Neck Stretching.fbx | Riscaldamento caviglie |
| Praying.fbx | Defaticamento schiena bassa |
| Jumping Jacks.fbx | Bonus |

Fonti alternative per nuovi modelli:
- https://free3d.com/
- https://open3dmodel.com/
- https://sketchfab.com/features/free-3d-models

## Exercises source

- ./scheda_calisthenics.pdf

## How to run locally

Serve un server HTTP — aprire `index.html` direttamente con `file://` non funziona (i moduli ES e i FBX richiedono HTTP).

```bash
npx serve .          # porta 3000
# oppure Live Server in Kiro/VS Code → porta 5500
```
