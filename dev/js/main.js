import * as THREE from 'three';
// Importamos los controles de órbita para poder mover la cámara con el ratón
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

// ---- Configuración Básica ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('bg-canvas'),
    antialias: true // Para que los bordes se vean más suaves
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Posicionamos la cámara para que no esté en el origen
camera.position.z = 5;


const loader = new THREE.TextureLoader();
loader.load(
    '/images/uvs-maps/milky-way-image.jpg',
    (texture) => {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        
        // Establecemos la textura cargada como el fondo permanente de todo nuestro universo.
        scene.background = texture;
        console.log("Fondo del universo cargado correctamente.");
    },
    undefined, // No necesitamos una función de progreso
    (err) => {
        console.error('Ocurrió un error al cargar la textura del fondo.', err);
    }
);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff }); // Un material blanco que reacciona a la luz
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);


// ---- Añadir una Luz ----
// Sin luz, el cubo se vería negro.
const pointLight = new THREE.PointLight(0xffffff, 100); // Luz blanca
pointLight.position.set(5, 5, 5);
scene.add(pointLight);


// ---- Añadir Controles de Órbita ----
// Esto nos permitirá rotar la escena con el ratón para confirmar que el fondo 360 funciona
const controls = new OrbitControls(camera, renderer.domElement);

const animationScript = [
    {
        scrollStart: 0,    // Comienza al 0% del scroll
        scrollEnd: 15,     // Termina al 15%
        cameraStart: { z: 5 },
        cameraEnd: { z: 15 } // Acto I: Nos alejamos un poco para ver la escena
    },
    {
        scrollStart: 15,   // Comienza al 15%
        scrollEnd: 35,     // Termina al 35%
        cameraStart: { z: 15 },
        cameraEnd: { z: -2 } // Acto II: Viaje rápido hacia el portal
    },
    // ... aquí añadiremos más escenas como la de la Tierra, etc.
];

function moveCamera() {
    const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (window.scrollY / scrollTotal) * 100;

    // Encontrar la escena actual en nuestro guion
    let currentScene = animationScript.find(
        scene => scrollPercent >= scene.scrollStart && scrollPercent <= scene.scrollEnd
    );

    if (currentScene) {
        // Calcular qué tan avanzados estamos DENTRO de la escena actual (de 0.0 a 1.0)
        const sceneScrollDuration = currentScene.scrollEnd - currentScene.scrollStart;
        const scrollWithinScene = scrollPercent - currentScene.scrollStart;
        const sceneProgress = scrollWithinScene / sceneScrollDuration;

        // Usamos la función lerp para calcular la nueva posición de la cámara
        camera.position.z = lerp(currentScene.cameraStart.z, currentScene.cameraEnd.z, sceneProgress);
    }

    // La rotación del cubo puede seguir siendo constante
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;
}

document.body.onscroll = moveCamera;
moveCamera();
// ---- Bucle de Animación ----
function animate() {
    requestAnimationFrame(animate);

    // Hacemos que el cubo rote para que se vea más 3D
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    controls.update(); // Actualiza los controles en cada frame

    renderer.render(scene, camera);
}

animate();

// ---- Manejar el redimensionamiento de la ventana ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

document.body.onscroll = moveCamera;
moveCamera();