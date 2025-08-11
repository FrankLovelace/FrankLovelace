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

function moveCamera() {
    // getBoundingClientRect() nos da la posición de un elemento relativo a la ventana.
    // .top nos dice cuántos píxeles hemos scrolleado desde el inicio del body.
    const t = document.body.getBoundingClientRect().top;

    // Rotamos un poco el cubo para darle más vida al movimiento
    cube.rotation.y += 0.005;
    cube.rotation.z += 0.005;

    // la posición z de la cámara se mapea directamente
    // al valor del scroll (t). Como t es negativo, lo multiplicamos por -0.01
    // para obtener un valor positivo y pequeño.
    // El '5' inicial es nuestra posición de zoom base.
    camera.position.z = t * -0.01 + 5;
    camera.position.x = t * -0.0002;
    camera.position.y = t * -0.0002;
}

// Le decimos al body que ejecute la función moveCamera cada vez que ocurra un evento de scroll
document.body.onscroll = moveCamera;
moveCamera(); // La llamamos una vez al inicio para establecer la posición inicial
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