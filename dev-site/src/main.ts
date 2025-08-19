import * as THREE from 'three';

// ---- CONFIGURACIÓN BÁSICA ----
const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas') as HTMLCanvasElement,
    antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

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


// ---- NUEVO MOTOR DE PROGRESO ----

let progress = 0; // Nuestro valor de "viaje", de 0 a 100.
const LERP_FACTOR = 0.07; // Suavizado del movimiento
let targetProgress = 0;

// Escuchamos la rueda del ratón
window.addEventListener('wheel', (event) => {
    // Aumentamos o disminuimos el progreso objetivo
    if (event.deltaY > 0) { // Rueda hacia abajo
        targetProgress += 2;
    } else { // Rueda hacia arriba
        targetProgress -= 2;
    }
    // Limitamos el progreso entre 0 y 100
    targetProgress = Math.max(0, Math.min(100, targetProgress));
});

// ---- El "Guion" de nuestro viaje ----
const sections = document.querySelectorAll('.scroll-section');
const timeline = [
    // Progreso 0-20: Muestra la sección de credenciales
    { start: 0, end: 20, sectionId: '#credentials', cameraStart: 5, cameraEnd: 8 },
    // Progreso 20-40: Muestra la sección del portal
    { start: 20, end: 40, sectionId: '#portal', cameraStart: 8, cameraEnd: 12 },
    // Progreso 40-60: Muestra la sección de proyectos
    { start: 40, end: 60, sectionId: '#projects', cameraStart: 12, cameraEnd: 16 },
    // Progreso 60-80: Muestra la sección "Sobre Mí"
    { start: 60, end: 80, sectionId: '#about', cameraStart: 16, cameraEnd: 20 },
    // Progreso 80-100: Muestra el título principal
    { start: 80, end: 100, sectionId: '#hero', cameraStart: 20, cameraEnd: 25 },
];

const lerp = (start: number, end: number, p: number): number => start * (1 - p) + end * p;

function updateScene(): void {
    // Suavizamos el progreso actual hacia el progreso objetivo
    progress = lerp(progress, targetProgress, LERP_FACTOR);

    // Encontrar la escena actual en la línea de tiempo
    const currentScene = timeline.find(scene => progress >= scene.start && progress < scene.end);

    // Actualizar la visibilidad de las secciones HTML
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
    }
    
    constellationGroup.rotation.y += 0.0005;
}

// ---- BUCLE DE ANIMACIÓN ----
function animate(): void {
    requestAnimationFrame(animate);
    updateScene(); // Actualizamos la escena en cada frame
    renderer.render(scene, camera);
}
animate();

// ---- MANEJAR REDIMENSIONAMIENTO ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});