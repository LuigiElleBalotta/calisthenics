# 🏋️ Allenamento a Corpo Libero — Calisthenics & Military

Sito web interattivo con **animazioni 3D scroll-driven** per due programmi di allenamento a corpo libero, senza attrezzi.

🔗 **Live demo:** [luigiellebalotta.github.io/calisthenics](https://luigiellebalotta.github.io/calisthenics/)

---

## 🎯 Scegli il tuo programma

La pagina principale mostra uno split-screen: scegli il programma e inizia.

| | Calisthenics | Military Workout |
|---|---|---|
| **Livello** | Principianti | Intermedio |
| **Struttura** | 3 giri del circuito | AMRAP 12 minuti |
| **Riposo** | 60-90 sec | 15-20 sec |
| **Tema** | 🟢 Verde | 🔴 Rosso |
| **Scheda PDF** | [calisthenics.pdf](./scheda_calisthenics.pdf) | [military.pdf](./scheda_military.pdf) |

---

## 📋 Scheda Calisthenics

6 esercizi a corpo libero, 3 giri, 2-3 sessioni a settimana.

| # | Esercizio | Ripetizioni |
|---|-----------|-------------|
| 1 | Squat | 10-15 rip. |
| 2 | Push-up sulle ginocchia | 6-10 rip. |
| 3 | Plank | 20-30 sec |
| 4 | Affondi (Lunge) | 8-10 per gamba |
| 5 | Superman | 10 rip. |
| 6 | Glute Bridge | 12-15 rip. |

## 📋 Scheda Military Workout

Circuito AMRAP 12 minuti. Conta quanti giri completi riesci a fare.

| # | Esercizio | Ripetizioni |
|---|-----------|-------------|
| 1 | Burpee | 8-10 rip. |
| 2 | Push-up completo | 12-15 rip. |
| 3 | Mountain Climber | 20 totali |
| 4 | Squat Jump | 12-15 rip. |
| 5 | Plank Shoulder Tap | 20 totali |
| 6 | High Knees | 30 sec |

---

## ✨ Funzionalità

**Desktop**
- Animazioni 3D **scroll-driven** (Apple-style) — il modello avanza frame-per-frame mentre scorri
- Canvas `sticky` fullscreen, testo in overlay a destra, modello visibile a sinistra
- Barra di progresso che mostra quanta animazione hai visto
- Superman e Glute Bridge mostrano un video YouTube reale

**Mobile**
- Animazione in **loop automatico** — no scroll-jacking (non affidabile su Safari iOS)
- Layout verticale: canvas + testo sotto
- Bottone "Vedi animazione" per il tutorial in modale

**Comune**
- Modale 3D con OrbitControls e autoRotate per ogni esercizio
- SEO: meta tag, Open Graph, Twitter Card, Schema.org
- Lazy-load dei modelli FBX
- Cache-busting automatico via GitHub Actions (commit SHA nei link CSS/JS)

---

## 🛠 Stack tecnico

| | |
|---|---|
| [Three.js](https://threejs.org/) r169 | Rendering 3D, FBXLoader, AnimationMixer |
| [GSAP](https://gsap.com/) 3.12 | Animazioni UI + ScrollTrigger scrub |
| CSS vanilla | Temi colore, layout responsive |

Zero framework, zero build step.

---

## 🚀 Come avviarlo in locale

```bash
git clone https://github.com/LuigiElleBalotta/calisthenics.git
cd calisthenics

# Con Live Server (Kiro / VS Code) → localhost:5500
# oppure:
npx serve .   # → localhost:3000
```

> ⚠️ Serve un server HTTP — `file://` non funziona.

---

## 📁 Struttura del progetto

```
index.html                          # Split-screen selezione programma
calisthenics.html                   # Scheda Calisthenics (tema verde)
military.html                       # Scheda Military Workout (tema rosso)
style.css                           # Stili condivisi
military.css                        # Override tema rosso
app.js                              # ES module — Calisthenics
military.js                         # ES module — Military
models/
├── Air Squat.fbx
├── Push Up.fbx
├── Plank.fbx
├── Crouching.fbx
├── Burpee.fbx
├── Crawling.fbx
├── Jumping Down.fbx
├── Catwalk Walk Forward HighKnees.fbx
└── ... (altri modelli riscaldamento/defaticamento)
scheda_calisthenics.pdf
scheda_military.pdf
.github/workflows/deploy.yml        # GitHub Actions → GitHub Pages
```

---

## 📄 Licenza

Progetto personale a scopo educativo.
Animazioni 3D: [Mixamo](https://www.mixamo.com/) (Adobe) — uso gratuito non commerciale.
