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

// ---- ASSETS Y OBJETOS 3D (sin cambios) ----
let universeTexture: THREE.Texture | null = null;
let portalSphere: THREE.Mesh | null = null;
const loader = new THREE.TextureLoader();

loader.load('/images/uvs-maps/milky-way-image.jpg', (texture) => {
    universeTexture = texture;
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    createPortalSphere();
});

scene.add(new THREE.AmbientLight(0xffffff, 0.5));

function createPortalSphere(): void {
    if (!universeTexture) return;
    const portalGeometry = new THREE.SphereGeometry(4, 64, 64);
    const portalMaterial = new THREE.MeshStandardMaterial({
        map: universeTexture,
        metalness: 0.2,
        roughness: 0.7,
    });
    portalSphere = new THREE.Mesh(portalGeometry, portalMaterial);
    portalSphere.visible = false;
    scene.add(portalSphere);
}

// ---- MOTOR DE PROGRESO Y VIAJE (sin cambios) ----
let progress = 0;
const LERP_FACTOR = 0.07;
let targetProgress = 0;

window.addEventListener('wheel', (event) => {
    const direction = event.deltaY > 0 ? 1 : -1;
    targetProgress += direction * 3;
    targetProgress = Math.max(0, Math.min(100, targetProgress));
});

// ---- El "Guion" del viaje (sin cambios) ----
const timeline = [
    { start: 0,   end: 20,  sectionId: '#hero',        cameraStart: 25, cameraEnd: 20 },
    { start: 20,  end: 40,  sectionId: '#about',       cameraStart: 20, cameraEnd: 16 },
    { start: 40,  end: 60,  sectionId: '#projects',    cameraStart: 16, cameraEnd: 12 },
    { start: 60,  end: 80,  sectionId: '#portal',      cameraStart: 12, cameraEnd: 8 },
    { start: 80,  end: 100, sectionId: '#credentials', cameraStart: 8,  cameraEnd: 5 },
];

const lerp = (start: number, end: number, p: number): number => start * (1 - p) + end * p;

// ---- EL DIRECTOR DE ORQUESTA  ----
function updateScene(): void {
    // El progreso y el lerp para suavizarlo no cambian
    progress = lerp(progress, targetProgress, LERP_FACTOR);

    // 1. Iteramos sobre TODAS las escenas del timeline para calcular el estado de CADA UNA
    timeline.forEach(sceneData => {
        const htmlSection = document.querySelector(sceneData.sectionId) as HTMLElement;
        if (!htmlSection) return;

        const sceneDuration = sceneData.end - sceneData.start;
        
        // Calculamos qué tan "avanzados" estamos dentro del rango de esta escena
        // Un valor negativo significa que aún no hemos llegado.
        // Un valor entre 0 y 1 significa que estamos dentro.
        // Un valor > 1 significa que ya la hemos pasado.
        const progressWithinScene = (progress - sceneData.start) / sceneDuration;

        let opacity = 0;
        let scale = 0.5;

        if (progressWithinScene >= 0 && progressWithinScene <= 1) {
            // Estamos DENTRO de la escena
            if (progressWithinScene < 0.5) {
                // Fade In (primera mitad)
                opacity = progressWithinScene * 2;
                scale = lerp(0.5, 1, progressWithinScene * 2);
            } else {
                // Fade Out (segunda mitad)
                opacity = 1 - (progressWithinScene - 0.5) * 2;
                scale = lerp(1, 1.5, (progressWithinScene - 0.5) * 2);
            }
        }
        
        // Excepción para la primera escena (#hero)
        if (sceneData.sectionId === '#hero' && progress < sceneData.end) {
            // Si estamos en la primera escena o antes, la forzamos a ser visible.
            opacity = 1 - (progressWithinScene * 0.5); // Desaparece más lento
            scale = 1;
        }

        // Aplicamos los valores
        htmlSection.style.setProperty('--opacity', `${opacity}`);
        htmlSection.style.setProperty('--scale', `${scale}`);
        htmlSection.style.setProperty('--pointer-events', opacity > 0.8 ? 'auto' : 'none');
    });

    // 2. Encontrar la escena actual para la cámara y los objetos 3D
    const currentScene = timeline.find(scene => progress >= scene.start && progress < scene.end);

    // 3. Actualizar objetos 3D (lógica sin cambios)
    if (portalSphere) {
        portalSphere.visible = currentScene?.sectionId === '#portal';
        if (portalSphere.visible) portalSphere.position.z = 2;
    }

    // 4. Actualizar la cámara (lógica sin cambios)
    if (currentScene) {
        const sceneDuration = currentScene.end - currentScene.start;
        const progressWithinScene = (progress - currentScene.start) / sceneDuration;
        camera.position.z = lerp(currentScene.cameraStart, currentScene.cameraEnd, progressWithinScene);
    } else if (progress < timeline[0].start) {
        camera.position.z = timeline[0].cameraStart;
    }
}


// ---- LÓGICA DE INTERACCIÓN (ARRASTRE Y CLIC) ----
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let isDragging = false;
let hasDragged = false; // <-- NUEVA VARIABLE para detectar si hubo movimiento
const rotationSpeed = 0.005;

window.addEventListener('mousedown', (event) => {
    if (!portalSphere || !portalSphere.visible) return;

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(portalSphere);

    if (intersects.length > 0) {
        isDragging = true;
        hasDragged = false; // Reseteamos el estado de arrastre en cada nuevo clic
    }
});

window.addEventListener('mousemove', (event) => {
    if (isDragging && portalSphere) {
        hasDragged = true; // <-- MARCAMOS que ha habido movimiento
        portalSphere.rotation.y += event.movementX * rotationSpeed;
        portalSphere.rotation.x += event.movementY * rotationSpeed;
    }
});

window.addEventListener('mouseup', () => {
    // ---- LÓGICA DE CLIC AÑADIDA ----
    // Si soltamos el clic Y no hemos arrastrado, lo consideramos un clic simple.
    if (isDragging && !hasDragged) {
        console.log("Clic detectado. Navegando a /portal.html");
        window.location.href = '/portal.html';
    }
    
    // Desactivamos el modo arrastre sin importar qué
    isDragging = false;
});


// ---- BUCLE DE ANIMACIÓN PRINCIPAL (sin cambios) ----
function animate(): void {
    requestAnimationFrame(animate);
    updateScene();

    if (!isDragging && portalSphere) {
        portalSphere.rotation.y += 0.0005;
    }

    renderer.render(scene, camera);
}
animate();

// ---- MANEJAR REDIMENSIONAMIENTO (sin cambios) ----
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});