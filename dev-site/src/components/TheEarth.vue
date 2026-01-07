<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';
import * as THREE from 'three';

const router = useRouter();
const container = ref<HTMLDivElement | null>(null);

let renderer: THREE.WebGLRenderer;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let earthMesh: THREE.Mesh;
let animationId: number;

let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };
let isHovering = false;
let dragStartX = 0;
let dragStartY = 0;

onMounted(() => {
  if (!container.value) return;

  const width = container.value.clientWidth;
  const height = container.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 2.5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  container.value.appendChild(renderer.domElement);

  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('/earth.jpg');

  const geometry = new THREE.SphereGeometry(0.8, 64, 64);
  const material = new THREE.MeshPhongMaterial({
    map: earthTexture,
    bumpMap: earthTexture,
    bumpScale: 0.02,
    specular: new THREE.Color('grey'),
    shininess: 10
  });

  earthMesh = new THREE.Mesh(geometry, material);
  scene.add(earthMesh);

  const ambientLight = new THREE.AmbientLight(0x333333);
  scene.add(ambientLight);

  const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const domEl = renderer.domElement;

  domEl.addEventListener('mousedown', onMouseDown);
  domEl.addEventListener('mousemove', onMouseMove);
  domEl.addEventListener('mouseup', onMouseUp);
  domEl.addEventListener('touchstart', onTouchStart, { passive: false });
  domEl.addEventListener('touchmove', onTouchMove, { passive: false });
  domEl.addEventListener('touchend', onTouchEnd);

  domEl.addEventListener('mouseenter', () => { document.body.style.cursor = 'grab'; });
  domEl.addEventListener('mouseleave', () => {
    document.body.style.cursor = 'default';
    isDragging = false;
  });

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (!isDragging) {
      earthMesh.rotation.y += 0.001;
    }

    renderer.render(scene, camera);
  };
  animate();

  window.addEventListener('resize', handleResize);
});

function onMouseDown(e: MouseEvent) {
  isDragging = true;
  previousMousePosition = { x: e.clientX, y: e.clientY };
  dragStartX = e.clientX;
  dragStartY = e.clientY;
  document.body.style.cursor = 'grabbing';
}

function onMouseMove(e: MouseEvent) {
  checkIntersection(e.clientX, e.clientY);

  if (isDragging) {
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    };

    const rotateSpeed = 0.005;
    earthMesh.rotation.y += deltaMove.x * rotateSpeed;
    earthMesh.rotation.x += deltaMove.y * rotateSpeed;

    previousMousePosition = { x: e.clientX, y: e.clientY };
  }
}

function onMouseUp(e: MouseEvent) {
  isDragging = false;
  document.body.style.cursor = 'grab';

  const dist = Math.sqrt(Math.pow(e.clientX - dragStartX, 2) + Math.pow(e.clientY - dragStartY, 2));

  if (dist < 5 && isHovering) {
    navigateToPortal();
  }
}

function onTouchStart(e: TouchEvent) {
  if(e.touches.length === 1) {
    const touch = e.touches[0];
    if (!touch) return;
    isDragging = true;
    previousMousePosition = { x: touch.clientX, y: touch.clientY };
    dragStartX = touch.clientX;
    dragStartY = touch.clientY;
  }
}
function onTouchMove(e: TouchEvent) {
    if(isDragging && e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        if (!touch) return;
        const deltaX = touch.clientX - previousMousePosition.x;
        const deltaY = touch.clientY - previousMousePosition.y;
        earthMesh.rotation.y += deltaX * 0.005;
        earthMesh.rotation.x += deltaY * 0.005;
        previousMousePosition = { x: touch.clientX, y: touch.clientY };
    }
}
function onTouchEnd() {
    isDragging = false;

}


function checkIntersection(x: number, y: number) {
    if (!earthMesh || !camera) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earthMesh);

    isHovering = intersects.length > 0;

    if (!isDragging) {
        document.body.style.cursor = isHovering ? 'pointer' : 'default';
    }
}

function navigateToPortal() {
  console.log("Viajando al portal...");
  router.push('/portal');
}

const handleResize = () => {
  if (!container.value) return;
  const width = container.value.clientWidth;
  const height = container.value.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
};

onBeforeUnmount(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', handleResize);
  if (renderer) renderer.dispose();
});
</script>

<template>
  <div ref="container" class="w-full h-full absolute inset-0 z-0 touch-none"></div>
</template>
