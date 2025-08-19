import * as THREE from 'three';

// ---- CONFIGURACIÓN BÁSICA ----
const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas') as HTMLCanvasElement,
    antialias: true,
    alpha: true // Hacemos el fondo del canvas transparente
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// ---- CARGAR EL FONDO DEL UNIVERSO (SKYBOX) ----
const loader = new THREE.TextureLoader();
loader.load(
    '/images/uvs-maps/milky-way-image.jpg', // Ruta desde la carpeta 'public'
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
        console.log("Fondo 3D cargado.");
    }
);

// ---- LUZ ----
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// ---- PLACEHOLDER PARA LAS CONSTELACIONES ----
// Creamos un grupo para mantener nuestras estrellas de prueba juntas.
const constellationGroup = new THREE.Group();
// Creamos 50 estrellas en posiciones aleatorias cerca del centro.
for (let i = 0; i < 50; i++) {
    const geometry = new THREE.SphereGeometry(0.05, 8, 8); // Esferas pequeñas
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const star = new THREE.Mesh(geometry, material);
    star.position.set(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
    );
    constellationGroup.add(star);
}
scene.add(constellationGroup);


// ---- LÓGICA DE SCROLL INVERSO Y ZOOM ----
const lerp = (start: number, end: number, progress: number): number => start * (1 - progress) + end * progress;

function updateCameraPosition(): void {
    const content = document.getElementById('content');
    if (!content) return;

    const scrollTotal = content.scrollHeight - window.innerHeight;
    if (scrollTotal <= 0) return;

    // Calculamos el porcentaje de scroll. 0 es arriba, 100 es abajo.
    const scrollPercent = (window.scrollY / scrollTotal) * 100;

    // Invertimos el progreso para que el scroll hacia arriba sea el "avance"
    const progress = 1 - (scrollPercent / 100);

    // Definimos el rango del zoom. Empezamos lejos (z=50) y terminamos cerca (z=5).
    const startZ = 50;
    const endZ = 5;

    // Usamos LERP para mover la cámara suavemente a lo largo del eje Z.
    camera.position.z = lerp(startZ, endZ, progress);
}

// Forzamos el scroll al final de la página al cargar
window.scrollTo(0, document.body.scrollHeight);

// Escuchamos el evento de scroll
window.addEventListener('scroll', updateCameraPosition);
updateCameraPosition(); // Llamada inicial para establecer la posición


// ---- BUCLE DE ANIMACIÓN ----
function animate(): void {
    requestAnimationFrame(animate);

    // Hacemos que la constelación rote lentamente para darle vida
    constellationGroup.rotation.y += 0.0005;

    renderer.render(scene, camera);
}
animate();


// ---- MANEJAR REDIMENSIONAMIENTO ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});