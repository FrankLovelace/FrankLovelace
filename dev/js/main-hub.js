import * as THREE from 'three';
// Por ahora, no importaremos OrbitControls. Está despedido.
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ---- Configuración Básica ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas'),
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// La posición inicial de la cámara la definirá el guion.

// ---- Cargar Textura y Objetos ----
const loader = new THREE.TextureLoader();
loader.load(
    'images/uvs-maps/milky-way-image.jpg',
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        scene.background = texture;
    }
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube); // El cubo sigue ahí, en la posición (0,0,0)

const pointLight = new THREE.PointLight(0xffffff, 150);
pointLight.position.set(5, 5, 5);
scene.add(pointLight);
scene.add(new THREE.AmbientLight(0xffffff, 0.3));

// ---- CONTROLES DESACTIVADOS ----
// const controls = new OrbitControls(camera, renderer.domElement);

// ---- NUEVO GUION CINEMÁTICO ----
// Ahora definimos la posición Y el punto de mira de la cámara.
// Usamos Vectores de Three.js para que sea más limpio.
const animationScript = [
    {
        scrollStart: 0,
        scrollEnd: 50,
        start: {
            cameraPos: new THREE.Vector3(0, 0, 10),  // Empezamos lejos
            lookAt: new THREE.Vector3(0, 0, 0)     // Mirando al cubo
        },
        end: {
            cameraPos: new THREE.Vector3(0, 0, 3),   // Nos acercamos
            lookAt: new THREE.Vector3(0, 0, 0)     // Seguimos mirando al cubo
        }
    },
    {
        scrollStart: 50,
        scrollEnd: 100,
        start: {
            cameraPos: new THREE.Vector3(0, 0, 3),   // Desde la posición anterior
            lookAt: new THREE.Vector3(0, 0, 0)     // Empezamos mirando al cubo
        },
        end: {
            cameraPos: new THREE.Vector3(5, 5, -5),  // Nos movemos a un lado y detrás del cubo
            lookAt: new THREE.Vector3(0, 0, 0)     // La cámara gira para seguir mirando al cubo
        }
    }
];

// ---- LA NUEVA FUNCIÓN DE SCROLL: EL DIRECTOR ----
function updateCameraFromScroll() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollTotal <= 0) return;

    const scrollPercent = (window.scrollY / scrollTotal) * 100;

    // Encontrar la escena actual en el guion
    const currentScene = animationScript.find(
        scene => scrollPercent >= scene.scrollStart && scrollPercent <= scene.scrollEnd
    );

    if (!currentScene) return;

    // Calcular el progreso dentro de la escena (de 0.0 a 1.0)
    const sceneDuration = currentScene.scrollEnd - currentScene.scrollStart;
    const scrollWithinScene = scrollPercent - currentScene.scrollStart;
    const progress = scrollWithinScene / sceneDuration;

    // Usamos el método .lerp() de Vector3 para una interpolación suave y limpia
    const newCamPos = new THREE.Vector3().lerpVectors(currentScene.start.cameraPos, currentScene.end.cameraPos, progress);
    const newLookAt = new THREE.Vector3().lerpVectors(currentScene.start.lookAt, currentScene.end.lookAt, progress);

    // Aplicamos las nuevas posiciones
    camera.position.copy(newCamPos);
    camera.lookAt(newLookAt);
}

window.addEventListener('scroll', updateCameraFromScroll);
updateCameraFromScroll(); // Llamada inicial

// ---- Bucle de Animación ----
function animate() {
    requestAnimationFrame(animate);
    // El bucle de animación ahora es muy simple. Solo renderiza.
    renderer.render(scene, camera);
}
animate();

// ---- Manejar Redimensionamiento ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});