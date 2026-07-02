import * as THREE from 'three';
import { FBXLoader }     from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const gsap          = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
gsap.registerPlugin(ScrollTrigger);

const EXERCISES = {
  squat: {
    title: 'Squat',
    reps:  '10-15 ripetizioni',
    model: 'models/Air Squat.fbx',
    desc:  "Piedi alla larghezza delle spalle, punte leggermente verso l'esterno. Spingi il bacino indietro come se ti sedessi su una sedia, schiena dritta. Scendi a cosce parallele al pavimento, poi risali spingendo sui talloni.",
    tips:  ['Ginocchia in linea con i piedi', 'Schiena dritta per tutto il movimento', 'Talloni sempre a contatto col pavimento'],
  },
  pushup: {
    title: 'Push-up sulle ginocchia',
    reps:  '6-10 ripetizioni',
    model: 'models/Push Up.fbx',
    desc:  "Mani più larghe delle spalle, ginocchia a terra. Corpo dritto dalla testa alle ginocchia. Scendi col petto a sfiorare il pavimento, poi risali spingendo.",
    tips:  ['Corpo in linea dalla testa alle ginocchia', 'Gomiti a 45° rispetto al busto', 'Petto quasi a toccare il pavimento'],
  },
  plank: {
    title: 'Plank',
    reps:  '20-30 secondi',
    model: 'models/Plank.fbx',
    desc:  "Avambracci a terra, gomiti sotto le spalle. Corpo in linea retta dalla testa ai piedi. Contrai addome e glutei, respira normalmente.",
    tips:  ['Gomiti direttamente sotto le spalle', 'Bacino né alto né basso', 'Sguardo verso il basso, collo neutro'],
  },
  lunge: {
    title: 'Affondi (Lunge)',
    reps:  '8-10 per gamba',
    model: 'models/Crouching.fbx',
    desc:  "Passo avanti, scendi piegando le ginocchia a 90°. Il ginocchio davanti non supera la punta del piede, quello posteriore sfiora il pavimento. Risali e alterna.",
    tips:  ['Busto sempre eretto', 'Ginocchio posteriore a sfiorare il pavimento', 'Ginocchio anteriore non oltre la punta'],
  },
  superman: {
    title: 'Superman',
    reps:  '10 ripetizioni',
    model: 'models/Plank.fbx',
    proceduralClip: 'superman',
    desc:  "A pancia in giù, braccia tese in avanti. Solleva braccia, petto e gambe insieme mantenendo lo sguardo verso il basso. Tieni 2-3 secondi, poi scendi lentamente.",
    tips:  ['Tutto si solleva in un unico movimento', 'Sguardo a terra per proteggere il collo', 'Discesa sempre controllata'],
  },
  glutebridge: {
    title: 'Glute Bridge',
    reps:  '12-15 ripetizioni',
    model: 'models/Plank.fbx',
    proceduralClip: 'glutebridge',
    desc:  "Schiena a terra, ginocchia piegate, piedi vicino ai glutei. Spingi i talloni e solleva il bacino contraendo i glutei. Linea retta spalle-ginocchia. Scendi lentamente.",
    tips:  ['Contrai i glutei in cima al movimento', 'Talloni spingono forte a terra', 'Non far cadere il bacino di colpo'],
  },
};

// ─── Procedural animation clips ───────────────────────────────────────────
const DEG = Math.PI / 180;

function quatFromEuler(x, y, z) {
  const q = new THREE.Quaternion();
  q.setFromEuler(new THREE.Euler(x * DEG, y * DEG, z * DEG, 'XYZ'));
  return [q.x, q.y, q.z, q.w];
}

function makeQuatTrack(boneName, times, eulers) {
  const values = eulers.flatMap(([x, y, z]) => quatFromEuler(x, y, z));
  return new THREE.QuaternionKeyframeTrack(`${boneName}.quaternion`, times, values);
}

function buildSupermanClip() {
  const T = [0, 0.1, 1.8, 3.0, 4.0];
  return new THREE.AnimationClip('superman', 4, [
    // Hips: prone face-down. At peak arch slightly upward.
    makeQuatTrack('mixamorigHips', T, [
      [-90, 0, 0], [-90, 0, 0], [-78, 0, 0], [-78, 0, 0], [-90, 0, 0],
    ]),
    // Spine arches back at peak
    makeQuatTrack('mixamorigSpine',  T, [[0,0,0],[0,0,0],[22,0,0],[22,0,0],[0,0,0]]),
    makeQuatTrack('mixamorigSpine1', T, [[0,0,0],[0,0,0],[18,0,0],[18,0,0],[0,0,0]]),
    makeQuatTrack('mixamorigSpine2', T, [[0,0,0],[0,0,0],[12,0,0],[12,0,0],[0,0,0]]),
    // Left arm stretched forward then lifts slightly
    makeQuatTrack('mixamorigLeftArm', T, [
      [-5, 0, -165], [-5, 0, -165], [-5, 0, -155], [-5, 0, -155], [-5, 0, -165],
    ]),
    makeQuatTrack('mixamorigRightArm', T, [
      [-5, 0, 165], [-5, 0, 165], [-5, 0, 155], [-5, 0, 155], [-5, 0, 165],
    ]),
    // Legs lift at hip
    makeQuatTrack('mixamorigLeftUpLeg',  T, [[0,0,0],[0,0,0],[-22,0,0],[-22,0,0],[0,0,0]]),
    makeQuatTrack('mixamorigRightUpLeg', T, [[0,0,0],[0,0,0],[-22,0,0],[-22,0,0],[0,0,0]]),
  ]);
}

function buildGluteBridgeClip() {
  const T = [0, 0.1, 1.5, 2.5, 3.5];
  return new THREE.AnimationClip('glutebridge', 3.5, [
    // Hips supine (face up = +90 on X), then drive up
    makeQuatTrack('mixamorigHips', T, [
      [90, 0, 0], [90, 0, 0], [42, 0, 0], [42, 0, 0], [90, 0, 0],
    ]),
    makeQuatTrack('mixamorigSpine', T, [
      [0,0,0],[0,0,0],[-8,0,0],[-8,0,0],[0,0,0],
    ]),
    // Knees bent: UpLeg angles forward, Leg angles back to keep feet on ground
    makeQuatTrack('mixamorigLeftUpLeg', T, [
      [-75,0,0],[-75,0,0],[-48,0,0],[-48,0,0],[-75,0,0],
    ]),
    makeQuatTrack('mixamorigRightUpLeg', T, [
      [-75,0,0],[-75,0,0],[-48,0,0],[-48,0,0],[-75,0,0],
    ]),
    makeQuatTrack('mixamorigLeftLeg', T, [
      [75,0,0],[75,0,0],[50,0,0],[50,0,0],[75,0,0],
    ]),
    makeQuatTrack('mixamorigRightLeg', T, [
      [75,0,0],[75,0,0],[50,0,0],[50,0,0],[75,0,0],
    ]),
    // Arms relaxed at sides on floor
    makeQuatTrack('mixamorigLeftArm',  T, [[0,0,-40],[0,0,-40],[0,0,-40],[0,0,-40],[0,0,-40]]),
    makeQuatTrack('mixamorigRightArm', T, [[0,0, 40],[0,0, 40],[0,0, 40],[0,0, 40],[0,0, 40]]),
  ]);
}

const PROCEDURAL_CLIPS = { superman: buildSupermanClip, glutebridge: buildGluteBridgeClip };

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
  scene.background = new THREE.Color(0x0a0a0a);
  scene.fog = new THREE.FogExp2(0x0a0a0a, 0.005);

  const camera = new THREE.PerspectiveCamera(42, W / H, 1, 2000);
  camera.position.set(0, 110, 230);
  camera.lookAt(0, 80, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));

  const sun = new THREE.DirectionalLight(0xffffff, 1.2);
  sun.position.set(120, 200, 120);
  sun.castShadow = true;
  sun.shadow.camera.left   = -200;
  sun.shadow.camera.right  =  200;
  sun.shadow.camera.top    =  200;
  sun.shadow.camera.bottom = -200;
  sun.shadow.camera.near   = 1;
  sun.shadow.camera.far    = 1000;
  sun.shadow.mapSize.setScalar(1024);
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0xa3e635, 0.22);
  fill.position.set(-120, 60, -80);
  scene.add(fill);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(600, 600),
    new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.95 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);

  scene.add(new THREE.GridHelper(500, 25, 0x252525, 0x1a1a1a));

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

function loadFBX(path, scene, proceduralClipName) {
  return new Promise((resolve, reject) => {
    new FBXLoader().load(
      path,
      (obj) => {
        obj.traverse((child) => {
          if (!child.isMesh) return;
          child.castShadow    = true;
          child.receiveShadow = true;
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          mats.forEach((m) => { m.roughness = 0.7; m.metalness = 0.1; });
        });
        const box  = new THREE.Box3().setFromObject(obj);
        const h    = box.getSize(new THREE.Vector3()).y;
        if (h > 0) obj.scale.setScalar(170 / h);
        const box2 = new THREE.Box3().setFromObject(obj);
        const cen  = box2.getCenter(new THREE.Vector3());
        obj.position.set(-cen.x, -box2.min.y, -cen.z);
        scene.add(obj);

        // Replace animations with procedural clip if requested
        if (proceduralClipName && PROCEDURAL_CLIPS[proceduralClipName]) {
          obj.animations = [PROCEDURAL_CLIPS[proceduralClipName]()];
        }

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
    const dt = clock.getDelta();
    getMixer()?.update(dt);
    renderer.render(scene, camera);
  };
  tick();
  return () => cancelAnimationFrame(id);
}

function heroAnims() {
  gsap.timeline({ delay: 0.25 })
    .fromTo('#hero-tag',   { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' })
    .fromTo('#hero-title', { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' }, '-=0.3')
    .fromTo('#hero-sub',   { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '-=0.35')
    .fromTo('#hero-cta',   { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.3')
    .fromTo('#hero-stats', { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5,  ease: 'power2.out' }, '-=0.25');
}

function cardAnims() {
  document.querySelectorAll('.card').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out', delay: i * 0.08,
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' } }
    );
  });
}

function initScrollScenes() {
  document.querySelectorAll('.scroll-scene').forEach((wrapper) => {
    const exId      = wrapper.dataset.exercise;
    const modelPath = wrapper.dataset.model;
    const exData    = EXERCISES[exId];
    const canvas    = wrapper.querySelector('.scene-canvas');
    const spinEl    = wrapper.querySelector('.spinner');
    const progEl    = wrapper.querySelector('.scene-progress');
    const hintEl    = wrapper.querySelector('.scene-hint');
    const infoEl    = wrapper.querySelector('.scene-info');

    const mobile = window.innerWidth < 768;

    let loaded   = false;
    let mixerRef = null;
    let clipDur  = 2;

    // Slide-in del testo
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
      const ro   = watchResize(canvas, camera, renderer);

      loadFBX(modelPath, scene, exData?.proceduralClip).then((obj) => {
        spinEl.style.display = 'none';
        canvas.style.opacity = '1';

        if (obj.animations.length) {
          const clip = obj.animations[0];
          clipDur    = clip.duration;
          mixerRef   = new THREE.AnimationMixer(obj);
          const act  = mixerRef.clipAction(clip);
          act.play();
          mixerRef.setTime(0);
        }

        if (mobile) {
          // ── MOBILE: animazione in loop autonomo, nessuno scroll-jacking ──
          startLoop(renderer, scene, camera, () => mixerRef);

        } else {
          // ── DESKTOP: scroll-jacking Apple-style ──
          // Render loop senza mixer (il mixer viene aggiornato via setTime, non via update)
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
}

function initModal() {
  const backdrop    = document.getElementById('modal-backdrop');
  const modalCanvas = document.getElementById('modal-canvas');
  const modalLoader = document.getElementById('modal-loader');
  const modalClose  = document.getElementById('modal-close');

  let stopFn   = null;
  let roModal  = null;
  let ctxModal = null;

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
    if (ctxModal) {
      ctxModal.scene.clear();
      ctxModal.renderer.dispose();
      ctxModal = null;
    }
    modalCanvas.style.opacity = '0';
    modalLoader.style.display = 'block';

    const { renderer, scene, camera } = buildScene(modalCanvas);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping    = true;
    controls.dampingFactor    = 0.06;
    controls.autoRotate       = true;
    controls.autoRotateSpeed  = 0.7;
    controls.target.set(0, 80, 0);
    controls.minDistance = 80;
    controls.maxDistance = 500;
    controls.update();

    let mixerModal = null;
    ctxModal = { renderer, scene, camera };
    roModal  = watchResize(modalCanvas, camera, renderer);
    stopFn   = startLoop(renderer, scene, camera, () => mixerModal);

    const clock = new THREE.Clock(true);
    let mId;
    const modalTick = () => {
      mId = requestAnimationFrame(modalTick);
      controls.update();
      mixerModal?.update(clock.getDelta());
      renderer.render(scene, camera);
    };
    modalTick();
    stopFn = () => cancelAnimationFrame(mId);

    loadFBX(data.model, scene, data.proceduralClip).then((obj) => {
      modalLoader.style.display = 'none';
      modalCanvas.style.opacity = '1';
      if (obj.animations.length) {
        mixerModal = new THREE.AnimationMixer(obj);
        mixerModal.clipAction(obj.animations[0]).play();
      }
    }).catch((err) => {
      console.warn('Modal FBX error:', err);
      modalLoader.style.display = 'none';
    });
  }

  function close() {
    gsap.to('#modal-box', {
      scale: 0.92, opacity: 0, duration: 0.25, ease: 'power2.in',
      onComplete() {
        backdrop.classList.remove('open');
        document.body.style.overflow = '';
        if (stopFn)  { stopFn();            stopFn  = null; }
        if (roModal) { roModal.disconnect(); roModal = null; }
        if (ctxModal) {
          ctxModal.scene.clear();
          ctxModal.renderer.dispose();
          ctxModal = null;
        }
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

heroAnims();
cardAnims();
initScrollScenes();
initModal();

window.addEventListener('resize', () => ScrollTrigger.refresh());
