
import * as THREE from 'three';

export function mountLattice(container: HTMLElement): void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    container.innerHTML = fallbackSvg();
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0.6, 7.2);
  camera.lookAt(0, 0, 0);

  const dpr = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  container.appendChild(renderer.domElement);

  const group = new THREE.Group();
  scene.add(group);

  const L = 2.6;
  const half = L / 2;
  const positions: THREE.Vector3[] = [];
  for (const x of [0, 1])
    for (const y of [0, 1])
      for (const z of [0, 1]) positions.push(new THREE.Vector3(x * L - half, y * L - half, z * L - half));
  const faces: [number, number, number][] = [
    [0.5, 0.5, 0], [0.5, 0.5, 1], [0.5, 0, 0.5], [0.5, 1, 0.5], [0, 0.5, 0.5], [1, 0.5, 0.5],
  ];
  faces.forEach(([x, y, z]) => positions.push(new THREE.Vector3(x * L - half, y * L - half, z * L - half)));

  const atomGeo = new THREE.SphereGeometry(0.23, 28, 28);
  const atomMat = new THREE.MeshStandardMaterial({
    color: 0xd9dade,
    roughness: 0.35,
    metalness: 0.15,
  });
  positions.forEach((pos) => {
    const atom = new THREE.Mesh(atomGeo, atomMat);
    atom.position.copy(pos);
    group.add(atom);
  });

  const linePts: THREE.Vector3[] = [];
  const corners = positions.slice(0, 8);
  const centers = positions.slice(8);
  corners.forEach((a, i) => {
    corners.forEach((b, j) => {
      if (j > i && a.distanceTo(b) <= L + 0.01 && a.distanceTo(b) >= L - 0.01) linePts.push(a, b);
    });
  });
  centers.forEach((c) => {
    corners.forEach((a) => {
      if (c.distanceTo(a) <= L * 0.75) linePts.push(c, a);
    });
  });
  const lineGeo = new THREE.BufferGeometry().setFromPoints(linePts);
  const lineMat = new THREE.LineBasicMaterial({ color: 0x6b6e76, transparent: true, opacity: 0.4 });
  group.add(new THREE.LineSegments(lineGeo, lineMat));

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 4, 5);
  scene.add(key);
  const spark = new THREE.PointLight(0x7da2e8, 14, 20);
  spark.position.set(-3, -1, 3);
  scene.add(spark);

  // the faint glow follows the pro/pop mode
  const syncSpark = () => {
    const pop = document.documentElement.dataset.mode === 'pop';
    spark.color.set(pop ? 0x22d3ee : 0x7da2e8);
    spark.intensity = pop ? 26 : 14;
  };
  syncSpark();
  new MutationObserver(syncSpark).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-mode'],
  });

  let vx = 0.0035;
  let vy = 0;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  const el = renderer.domElement;
  el.style.touchAction = 'pan-y';
  el.addEventListener('pointerdown', (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    vx = (e.clientX - lastX) * 0.0026;
    vy = (e.clientY - lastY) * 0.0026;
    lastX = e.clientX;
    lastY = e.clientY;
  });
  el.addEventListener('pointerup', () => (dragging = false));
  el.addEventListener('pointercancel', () => (dragging = false));

  const resize = () => {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(container);

  renderer.setAnimationLoop(() => {
    group.rotation.y += vx;
    group.rotation.x += vy;
    if (!dragging) {
      vx += (0.0035 - vx) * 0.02;
      vy += (0 - vy) * 0.02;
    }
    renderer.render(scene, camera);
  });
}

function fallbackSvg(): string {
  return `<svg viewBox="0 0 200 200" style="position:absolute;inset:0;margin:auto;max-width:380px;opacity:.5" aria-hidden="true">
    <g fill="none" stroke="#6b6e76" stroke-width="1">
      <rect x="50" y="60" width="90" height="90"/>
      <rect x="75" y="40" width="90" height="90"/>
      <path d="M50 60 75 40M140 60 165 40M50 150 75 130M140 150 165 130"/>
    </g>
    <g fill="#d9dade">
      <circle cx="50" cy="60" r="6"/><circle cx="140" cy="60" r="6"/>
      <circle cx="50" cy="150" r="6"/><circle cx="140" cy="150" r="6"/>
      <circle cx="75" cy="40" r="6"/><circle cx="165" cy="40" r="6"/>
      <circle cx="75" cy="130" r="6"/><circle cx="165" cy="130" r="6"/>
      <circle cx="95" cy="105" r="5"/><circle cx="120" cy="85" r="5"/>
    </g>
  </svg>`;
}
