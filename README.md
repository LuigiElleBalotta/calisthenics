# 🏋️ Calisthenics per Principianti

Sito web interattivo con **animazioni 3D scroll-driven** per imparare gli esercizi di calisthenics a corpo libero. Nessun attrezzo richiesto.

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

- **Animazioni 3D scroll-driven** — ogni sezione anima il modello man mano che scorri
- **Modelli FBX da Mixamo** — personaggi 3D reali con animazioni motion-captured
- **Modale tutorial** — clicca "Vedi animazione" per un tutorial in loop con controlli orbitali
- **Responsive** — funziona su desktop e mobile
- **SEO ottimizzato** — meta tag, Open Graph, Twitter Card e Schema.org

---

## 🛠 Stack tecnico

| Libreria | Versione | Uso |
|----------|----------|-----|
| [Three.js](https://threejs.org/) | r169 | Rendering 3D e FBXLoader |
| [GSAP](https://gsap.com/) | 3.12 | Animazioni scroll + ScrollTrigger |
| [Tailwind CSS](https://tailwindcss.com/) | Play CDN | Styling utility-first |

Zero build step — basta aprire `index.html` con qualsiasi server locale (es. Live Server).

---

## 🚀 Come avviarlo in locale

```bash
# Clona il repo
git clone https://github.com/LuigiElleBalotta/calisthenics.git
cd calisthenics

# Apri con Live Server (VS Code / Kiro) oppure:
npx serve .
# → http://localhost:3000
```

> ⚠️ I modelli FBX vengono caricati via fetch relativa, quindi serve un server HTTP — aprire `index.html` direttamente nel browser (protocollo `file://`) non funziona.

---

## 📁 Struttura del progetto

```
calisthenics/
├── index.html              # App principale
├── models/                 # Modelli FBX scaricati da Mixamo
│   ├── Air Squat.fbx
│   ├── Push Up.fbx
│   ├── Plank.fbx
│   ├── Crouching.fbx
│   ├── Situps.fbx
│   ├── Burpee.fbx
│   └── Jumping Jacks.fbx
├── scheda_calisthenics.pdf # Scheda originale
└── README.md
```

---

## 📄 Licenza

Progetto personale a scopo educativo.  
Animazioni 3D: [Mixamo](https://www.mixamo.com/) (Adobe) — uso gratuito non commerciale.
