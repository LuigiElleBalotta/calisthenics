# 🏋️ Calisthenics per Principianti

Sito web interattivo con **animazioni 3D** per imparare gli esercizi di calisthenics a corpo libero. Nessun attrezzo richiesto.

🔗 **Live demo:** [luigiellebalotta.github.io/calisthenics](https://luigiellebalotta.github.io/calisthenics/)

---

## 📋 La scheda

La scheda completa è disponibile nel file [`scheda_calisthenics.pdf`](./scheda_calisthenics.pdf).

**Struttura:** 3 giri del circuito · 60-90 sec di riposo · 2-3 sessioni a settimana

| # | Esercizio | Ripetizioni |
|---|-----------|-------------|
| 1 | Squat | 10-15 rip. |
| 2 | Push-up sulle ginocchia | 6-10 rip. |
| 3 | Plank | 20-30 sec |
| 4 | Affondi (Lunge) | 8-10 per gamba |
| 5 | Superman | 10 rip. |
| 6 | Glute Bridge | 12-15 rip. |

---

## ✨ Funzionalità

**Desktop**
- Animazioni 3D **scroll-driven** (Apple-style) — il modello si muove frame-per-frame mentre scorri
- Canvas `sticky` fullscreen, testo in overlay sul lato destro, modello visibile a sinistra
- Barra di progresso verde che mostra quanta animazione hai visto

**Mobile**
- Animazione in **loop automatico** — nessuno scroll-jacking (non affidabile su Safari iOS)
- Layout verticale: canvas + testo sotto
- Bottone "Vedi animazione" per aprire il tutorial completo

**Comune**
- Modale con OrbitControls e autoRotate per ogni esercizio
- SEO: meta tag, Open Graph, Twitter Card, Schema.org
- Lazy-load dei modelli FBX (caricati solo quando entrano nel viewport)

---

## 🛠 Stack tecnico

| Libreria | Versione | Uso |
|----------|----------|-----|
| [Three.js](https://threejs.org/) | r169 | Rendering 3D, FBXLoader, AnimationMixer |
| [GSAP](https://gsap.com/) | 3.12 | Animazioni UI + ScrollTrigger scrub |

CSS vanilla, zero framework, zero build step.

---

## 🚀 Come avviarlo in locale

```bash
git clone https://github.com/LuigiElleBalotta/calisthenics.git
cd calisthenics

# Con Live Server (Kiro / VS Code) → localhost:5500
# oppure:
npx serve .   # → localhost:3000
```

> ⚠️ Serve un server HTTP — `file://` non funziona perché i moduli ES e i file FBX richiedono HTTP.

---

## 📁 Struttura del progetto

```
calisthenics/
├── index.html              # Markup HTML
├── style.css               # Tutti gli stili
├── app.js                  # ES module — Three.js + GSAP
├── models/                 # Modelli FBX da Mixamo
│   ├── Air Squat.fbx
│   ├── Push Up.fbx
│   ├── Plank.fbx
│   ├── Crouching.fbx
│   ├── Situps.fbx
│   ├── Burpee.fbx
│   ├── Arm Stretching.fbx
│   ├── Twist Dance.fbx
│   ├── Neck Stretching.fbx
│   ├── Praying.fbx
│   └── Jumping Jacks.fbx
├── scheda_calisthenics.pdf # Scheda originale
├── CLAUDE.md               # Regole per chi sviluppa
└── README.md
```

---

## 📄 Licenza

Progetto personale a scopo educativo.  
Animazioni 3D: [Mixamo](https://www.mixamo.com/) (Adobe) — uso gratuito non commerciale.
