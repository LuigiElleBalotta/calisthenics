# Calisthenics Website — Developer Rules

## Mandatory libraries

- **Three.js r169** (ES module via importmap da jsdelivr)
- **GSAP 3.12** + ScrollTrigger (global via CDN, caricato prima del modulo)

## Struttura file

```
index.html          — split-screen selezione programma (puro CSS/HTML, no JS)
calisthenics.html   — scheda Calisthenics (tema verde lime)
military.html       — scheda Military Workout (tema rosso)
style.css           — CSS condiviso tra entrambe le pagine
military.css        — override variabili CSS per tema rosso (importato DOPO style.css)
app.js              — ES module per calisthenics.html
military.js         — ES module per military.html (stessa struttura di app.js)
models/             — file FBX da Mixamo
scheda_calisthenics.pdf
scheda_military.pdf
```

> ⚠️ Non mettere mai commenti HTML `<!-- -->` dentro `<script type="module">` — il browser li rifiuta come errore di sintassi e il modulo non parte.

## Temi colore

| Pagina | Accent | Classe body | CSS override |
|--------|--------|-------------|--------------|
| calisthenics.html | `#a3e635` (lime) | — | — |
| military.html | `#ef4444` (rosso) | `theme-military` | `military.css` |

Le variabili CSS sono definite in `style.css` con valori lime. `military.css` le sovrascrive tutte tramite `.theme-military { --lime: #ef4444; ... }`.

## Scroll behaviour — desktop vs mobile

### Desktop (≥ 768px) — Apple-style scroll-jacking

- Ogni esercizio ha un wrapper `.scroll-scene` con `height: 300vh`
- Il canvas interno è `position: sticky; top: 0; height: 100vh`
- GSAP ScrollTrigger con `scrub: 1` mappa il progresso (0→1) su `mixer.setTime(progress × clipDuration)`
- Testo e gradiente overlay sul lato **destro**; modello 3D visibile sul lato **sinistro**
- Progress bar verde/rossa in basso

### Mobile (< 768px) — loop autonomo

- Il wrapper `.scroll-scene` ha altezza automatica (niente `300vh`)
- Canvas `position: relative; height: 72vw; min-height: 280px`
- Animazione gira in **loop automatico** — nessuno scroll-jacking
- `.ex-divider`, `.scene-progress`, `.scene-hint` sono nascosti

### Eccezioni: YouTube embed (`.yt-scene`)

- Per Superman e Glute Bridge il canvas 3D è sostituito da un iframe YouTube
- **Superman**: `https://www.youtube.com/watch?v=z6PJMT2y8GQ`
- **Glute Bridge**: `https://www.youtube.com/watch?v=Vzy7WrsK58g`
- Stesso layout del `.scroll-scene` ma altezza fissa, nessuno scroll-jacking

## Layout conventions

- `.desktop-only` → `display: none` sotto 767px
- `.mobile-only`  → `display: none` sopra 768px
- Descrizioni e tips degli esercizi sono nascosti su mobile
- Il gradiente overlay va da destra (opaco) verso sinistra (trasparente) — mai coprire il modello 3D
- `back-link` (tornare alla selezione) in `military.html`; da aggiungere anche a `calisthenics.html` se mancante

## Cache busting

Il workflow GitHub Actions inietta il commit SHA nei link di `style.css` e `app.js`:

```yaml
sed -i "s|style\.css\"|style.css?v=${SHA}\"|g" index.html
sed -i "s|app\.js\"|app.js?v=${SHA}\"|g" index.html
```

## Modelli 3D

Fonte principale: **Mixamo** (https://www.mixamo.com)
Formato: FBX Binary, With Skin, 30fps, keyframe reduction: none

### Calisthenics

| Modello | Esercizio |
|---------|-----------|
| Air Squat.fbx | Squat |
| Push Up.fbx | Push-up sulle ginocchia |
| Plank.fbx | Plank |
| Crouching.fbx | Affondi (Lunge) |
| Getting Up Stomach.fbx | (base per animazioni procedurali) |
| Arm Stretching.fbx | Riscaldamento braccia/spalle |
| Twist Dance.fbx | Riscaldamento anche |
| Neck Stretching.fbx | Riscaldamento caviglie |
| Praying.fbx | Defaticamento schiena bassa |
| Jumping Jacks.fbx | Bonus |

Superman e Glute Bridge → **video YouTube** (vedi sopra)

### Military Workout

| Modello | Esercizio |
|---------|-----------|
| Burpee.fbx | Burpee |
| Push Up.fbx | Push-up completo |
| Crawling.fbx | Mountain Climber |
| Jumping Down.fbx | Squat Jump |
| Plank.fbx | Plank Shoulder Tap |
| Catwalk Walk Forward HighKnees.fbx | High Knees |

Fonti alternative per nuovi modelli:
- https://free3d.com/
- https://open3dmodel.com/
- https://sketchfab.com/features/free-3d-models

## Schede di allenamento

- `scheda_calisthenics.pdf` — scheda base principianti
- `scheda_military.pdf` — circuito AMRAP alta intensità

## Come avviare in locale

Serve un server HTTP — `file://` non funziona.

```bash
npx serve .          # porta 3000
# oppure Live Server in Kiro/VS Code → porta 5500
```
