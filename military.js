import * as THREE from 'three';
import { FBXLoader }     from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const gsap          = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

const EXERCISES = {
  burpee: {
    title: 'Burpee',
    reps:  '8-10 ripetizioni',
    model: 'models/Burpee.fbx',
    desc:  "Parti in piedi. Scendi in squat, appoggia le mani a terra e salta indietro in plank. Esegui un push-up (facoltativo), poi salta i piedi verso le mani e esplodi in alto con le braccia sopra la testa.",
    tips:  ['Esercizio più impegnativo del circuito', 'Rallenta se necessario ma mantieni la sequenza', 'Atterra morbido riassorbendo l\'impatto'],
  },
  'pushup-full': {
    title: 'Push-up completo',
    reps:  '12-15 ripetizioni',
    model: 'models/Push Up.fbx',
    desc:  "Gambe tese, solo le punte dei piedi a terra. Corpo dritto da testa a talloni. Gomiti a 45° rispetto al busto. Scendi fino a sfiorare il pavimento, poi risali.",
    tips:  ['Corpo in linea retta dalla testa ai talloni', 'Gomiti a 45°, non completamente aperti', 'Se perdi la forma, torna alla versione sulle ginocchia'],
  },
  'mountain-climber': {
    title: 'Mountain Climber',
    reps:  '20 totali (10 per gamba)',
    model: 'models/Crawling.fbx',
    desc:  "Posizione di plank con braccia tese. Porta un ginocchio verso il petto in modo esplosivo, poi torna e porta avanti l'altro, come una corsa in orizzontale. Mantieni i fianchi bassi e stabili.",
    tips:  ['Braccia tese, non piegate', 'Fianchi stabili, non oscillare su e giù', 'Ritmo esplosivo ma controllato'],
  },
  'squat-jump': {
    title: 'Squat Jump',
    reps:  '12-15 ripetizioni',
    model: 'models/Jumping Down.fbx',
    desc:  "Parti in squat. Esplodi verso l'alto con un salto, gambe completamente estese e braccia in alto. Atterra morbido piegando subito le ginocchia per tornare in squat.",
    tips:  ['Atterra morbido riassorbendo l\'impatto', 'Torna subito in squat senza pausa', 'Braccia aiutano la spinta verso l\'alto'],
  },
  'plank-tap': {
    title: 'Plank Shoulder Tap',
    reps:  '20 totali (10 per lato)',
    model: 'models/Plank.fbx',
    desc:  "Plank con braccia tese. Solleva una mano e tocca la spalla opposta, poi appoggiala e ripeti con l'altra. Il bacino deve restare il più fermo possibile, senza ruotare.",
    tips:  ['Bacino fermo, non ruotare da un lato all\'altro', 'Allarga i piedi per più stabilità se necessario', 'Movimento lento e controllato'],
  },
  'high-knees': {
    title: 'High Knees',
    reps:  '30 secondi',
    model: 'models/Catwalk Walk Forward HighKnees.fbx',
    desc:  "Corsa sul posto portando le ginocchia il più in alto possibile, idealmente fino all'altezza del bacino, con un ritmo rapido. Usa le braccia in coordinazione.",
    tips:  ['Ginocchia all\'altezza del bacino', 'Ritmo rapido per alzare il battito cardiaco', 'Braccia attive in coordinazione'],
  },
};

function buildScene(canvas) {
  const W = canvas.offsetWidth  || 400;
  const H = canvas.offsetHeight || 400;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(W, H, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0505);
  scene.fog = new THREE.FogExp2(0x0a0505, 0.005);

  const camera = new THREE.PerspectiveCamera(42, W / H, 1, 2000);
  camera.position.set(0, 110, 230);
  camera.lookAt(0, 80, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));

  const sun = new THREE.DirectionalLight(0xffffff, 1.1);
  sun.position.set(120, 200, 120);
  sun.castShadow = true;
  sun.shadow.camera.left = sun.shadow.camera.bottom = -200;
  sun.shadow.camera.right = sun.shadow.camera.top = 200;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far  = 1000;
  sun.shadow.mapSize.setScalar(1024);
  scene.add(sun);

  // Red fill light for military theme
  const fill = new THREE.DirectionalLight(0xef4444, 0.2);
  fill.position.set(-120, 60, -80);
  scene.add(fill);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshStandardMaterial({ color: 0x1a0808, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  scene.add(new THREE.GridHelper(500, 25, 0x2d1515, 0x1a0a0a));

  return { renderer, scene, camera };
}

function watchResize(canvas, camera, renderer) {
  const ro = new ResizeObserver(() => {
    const W = canvas.parentElement.clientWidth;
    const H = canvas.parentElement.clientHeight;
    if (!W || !H) return;
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
  });
  ro.observe(canvas.parentElement);
  return ro;
}

function loadFBX(path, scene) {
  return new Promise((resolve, reject) => {
    new FBXLoader().load(
      path,
      (obj) => {
        obj.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow = child.receiveShadow = true;
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => { m.roughness = 0.7; m.metalness = 0.1; });
        });
        const box = new THREE.Box3().setFromObject(obj);
        const h   = box.getSize(new THREE.Vector3()).y;
        if (h > 0) obj.scale.setScalar(170 / h);
        const box2 = new THREE.Box3().setFromObject(obj);
        const cen  = box2.getCenter(new THREE.Vector3());
        obj.position.set(-cen.x, -box2.min.y, -cen.z);
        scene.add(obj);
        resolve(obj);
      },
      undefined,
      reject
    );
  });
}

function startLoop(renderer, scene, camera, getMixer) {
  let id;
  const clock = new THREE.Clock(true);
  const tick  = () => {
    id = requestAnimationFrame(tick);
    getMixer()?.update(clock.getDelta());
    renderer.render(scene, camera);
  };
  tick();
  return () => cancelAnimationFrame(id);
}

// Hero anims
gsap.timeline({ delay: 0.25 })
  .fromTo('#hero-tag',   { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
  .fromTo('#hero-title', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.3')
  .fromTo('#hero-sub',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
  .fromTo('#hero-cta',   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
  .fromTo('#hero-stats', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.25');

document.querySelectorAll('.card').forEach((el, i) => {
  gsap.fromTo(el, { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.08,
    scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
  });
});

// Scroll-driven scenes
document.querySelectorAll('.scroll-scene').forEach((wrapper) => {
  const exId      = wrapper.dataset.exercise;
  const modelPath = wrapper.dataset.model;
  const canvas    = wrapper.querySelector('.scene-canvas');
  const spinEl    = wrapper.querySelector('.spinner');
  const progEl    = wrapper.querySelector('.scene-progress');
  const hintEl    = wrapper.querySelector('.scene-hint');
  const infoEl    = wrapper.querySelector('.scene-info');
  const mobile    = window.innerWidth < 768;

  let loaded = false, mixerRef = null, clipDur = 2;

  gsap.fromTo(
    infoEl.querySelectorAll('.scene-tag, .scene-title, .scene-desc, .scene-tips, .btn-anim'),
    { opacity: 0, x: mobile ? 0 : -30, y: mobile ? 16 : 0 },
    { opacity: 1, x: 0, y: 0, duration: 0.65, stagger: 0.07, ease: 'power2.out',
      scrollTrigger: { trigger: wrapper, start: 'top 75%', toggleActions: 'play none none none' } }
  );

  const io = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting || loaded) return;
    loaded = true;
    io.disconnect();

    const { renderer, scene, camera } = buildScene(canvas);
    watchResize(canvas, camera, renderer);

    loadFBX(modelPath, scene).then((obj) => {
      spinEl.style.display = 'none';
      canvas.style.opacity = '1';

      if (obj.animations.length) {
        const clip = obj.animations[0];
        clipDur    = clip.duration;
        mixerRef   = new THREE.AnimationMixer(obj);
        mixerRef.clipAction(clip).play();
        mixerRef.setTime(0);
      }

      if (mobile) {
        startLoop(renderer, scene, camera, () => mixerRef);
      } else {
        startLoop(renderer, scene, camera, () => null);
        ScrollTrigger.create({
          trigger: wrapper,
          start:   'top top',
          end:     'bottom bottom',
          scrub:   1,
          onUpdate(self) {
            if (!mixerRef) return;
            mixerRef.setTime(self.progress * clipDur);
            renderer.render(scene, camera);
            if (progEl) progEl.style.width = self.progress * 100 + '%';
            if (hintEl && self.progress > 0.03) hintEl.classList.add('hidden');
          },
        });
      }
    }).catch((err) => {
      console.warn('FBX load error:', modelPath, err);
      spinEl.style.display = 'none';
    });

  }, { rootMargin: '300px' });

  io.observe(wrapper);
});

// Modal
function initModal() {
  const backdrop    = document.getElementById('modal-backdrop');
  const modalCanvas = document.getElementById('modal-canvas');
  const modalLoader = document.getElementById('modal-loader');
  const modalClose  = document.getElementById('modal-close');

  let stopFn = null, roModal = null, ctxModal = null;

  function open(exId) {
    const data = EXERCISES[exId];
    if (!data) return;

    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-reps').textContent  = data.reps;
    document.getElementById('modal-desc').textContent  = data.desc;
    document.getElementById('modal-tips').innerHTML    = data.tips.map((t) => `<li>${t}</li>`).join('');

    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    gsap.fromTo('#modal-box', { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.32, ease: 'back.out(1.4)' });

    if (stopFn)  { stopFn();            stopFn  = null; }
    if (roModal) { roModal.disconnect(); roModal = null; }
    if (ctxModal) { ctxModal.scene.clear(); ctxModal.renderer.dispose(); ctxModal = null; }
    modalCanvas.style.opacity = '0';
    modalLoader.style.display = 'block';

    const { renderer, scene, camera } = buildScene(modalCanvas);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.06;
    controls.autoRotate = true; controls.autoRotateSpeed = 0.7;
    controls.target.set(0, 80, 0); controls.minDistance = 80; controls.maxDistance = 500;
    controls.update();

    let mixerModal = null;
    ctxModal = { renderer, scene, camera };
    roModal  = watchResize(modalCanvas, camera, renderer);

    const clock = new THREE.Clock(true);
    let mId;
    const loop = () => {
      mId = requestAnimationFrame(loop);
      controls.update();
      mixerModal?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    loop();
    stopFn = () => cancelAnimationFrame(mId);

    loadFBX(data.model, scene).then((obj) => {
      modalLoader.style.display = 'none';
      modalCanvas.style.opacity = '1';
      if (obj.animations.length) {
        mixerModal = new THREE.AnimationMixer(obj);
        mixerModal.clipAction(obj.animations[0]).play();
      }
    }).catch((err) => { console.warn('Modal FBX error:', err); modalLoader.style.display = 'none'; });
  }

  function close() {
    gsap.to('#modal-box', {
      scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (stopFn)  { stopFn();            stopFn  = null; }
        if (roModal) { roModal.disconnect(); roModal = null; }
        if (ctxModal) { ctxModal.scene.clear(); ctxModal.renderer.dispose(); ctxModal = null; }
        modalCanvas.style.opacity = '0';
        modalLoader.style.display = 'block';
      },
    });
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-anim[data-exercise]');
    if (btn) open(btn.dataset.exercise);
  });
  modalClose.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

initModal();
window.addEventListener('resize', () => ScrollTrigger.refresh());
