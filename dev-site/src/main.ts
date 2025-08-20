import * as THREE from 'three';

// ---- CONFIGURACIÓN BÁSICA (sin cambios) ----
const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas') as HTMLCanvasElement,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ---- ASSETS (sin cambios) ----
const loader = new THREE.TextureLoader();
loader.load('/images/uvs-maps/milky-way-image.jpg', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
});
scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const constellationGroup = new THREE.Group();
for (let i = 0; i < 50; i++) {
    const star = new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    star.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
    constellationGroup.add(star);
}
scene.add(constellationGroup);

// ---- MOTOR DE PROGRESO Y VIAJE ----

// El viaje ahora va de 0 a 100 a medida que el usuario baja.
let progress = 0;
const LERP_FACTOR = 0.07;
let targetProgress = 0;

window.addEventListener('wheel', (event) => {
    // Rueda hacia abajo aumenta el progreso, rueda hacia arriba lo disminuye.
    const direction = event.deltaY > 0 ? 1 : -1;
    targetProgress += direction * 3; // Aumentamos la sensibilidad
    targetProgress = Math.max(0, Math.min(100, targetProgress)); // Limitamos entre 0 y 100
});

// ---- El "Guion" del viaje (Ahora en orden natural) ----
const sections = document.querySelectorAll('.scroll-section');
const timeline = [
    { start: 0,   end: 20,  sectionId: '#hero',        cameraStart: 25, cameraEnd: 20 },
    { start: 20,  end: 40,  sectionId: '#about',       cameraStart: 20, cameraEnd: 16 },
    { start: 40,  end: 60,  sectionId: '#projects',    cameraStart: 16, cameraEnd: 12 },
    { start: 60,  end: 80,  sectionId: '#portal',      cameraStart: 12, cameraEnd: 8 },
    { start: 80,  end: 100, sectionId: '#credentials', cameraStart: 8,  cameraEnd: 5 },
];

const lerp = (start: number, end: number, p: number): number => start * (1 - p) + end * p;

function updateScene(): void {
    progress = lerp(progress, targetProgress, LERP_FACTOR);

    const currentScene = timeline.find(scene => progress >= scene.start && progress < scene.end);

    // Esta lógica es perfecta. No necesita cambiar.
    sections.forEach(section => {
        if (currentScene && section.matches(currentScene.sectionId)) {
            section.classList.add('is-visible');
        } else {
            section.classList.remove('is-visible');
        }
    });

    // Actualizar la posición de la cámara 3D
    if (currentScene) {
        const sceneDuration = currentScene.end - currentScene.start;
        const progressWithinScene = (progress - currentScene.start) / sceneDuration;
        camera.position.z = lerp(currentScene.cameraStart, currentScene.cameraEnd, progressWithinScene);
    } else if (progress < timeline[0].start) {
        // Aseguramos que la cámara esté en la posición inicial si el progreso es < 0
        camera.position.z = timeline[0].cameraStart;
    }
    
    constellationGroup.rotation.y += 0.0005;
}

// ---- BUCLE DE ANIMACIÓN ----
function animate(): void {
    requestAnimationFrame(animate);
    updateScene();
    renderer.render(scene, camera);
}
animate();

// ---- MANEJAR REDIMENSIONAMIENTO ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});