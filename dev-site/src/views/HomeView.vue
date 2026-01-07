<script setup lang="ts">
import { onMounted } from 'vue';
import FullScreenSection from '@/components/FullScreenSection.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  const panels = gsap.utils.toArray(".panel") as HTMLElement[];

  panels.forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      pin: true,
      pinSpacing: false,

    });
  });
});
</script>

<template>
  <main class="text-white">
    <FullScreenSection class="panel bg-gray-900 z-0">
      <h1 class="text-5xl font-bold">Sección 1</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-blue-900 z-10">
      <h1 class="text-5xl font-bold">Sección 2</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-indigo-900 z-20">
      <h1 class="text-5xl font-bold">Sección 3</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-purple-900 z-30">
      <h1 class="text-5xl font-bold">Sección 4</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <div class="h-screen bg-transparent"></div>
  </main>
</template>

<style scoped>
.panel {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
