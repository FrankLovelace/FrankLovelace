<script setup lang="ts">
import { onMounted } from 'vue';
import FullScreenSection from '@/components/FullScreenSection.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

onMounted(() => {
  const panels: HTMLElement[] = gsap.utils.toArray(".panel");
  panels.forEach((panel) => {
    ScrollTrigger.create({
      trigger: panel,
      start: "top top",
      pin: true,
      pinSpacing: false
    });
  });
});
</script>

<template>
  <main>
    <FullScreenSection class="panel bg-gray-900">
      <h1 class="text-5xl font-bold">Sección 1</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-blue-900">
      <h1 class="text-5xl font-bold">Sección 2</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-indigo-900">
      <h1 class="text-5xl font-bold">Sección 3</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>

    <FullScreenSection class="panel bg-purple-900">
      <h1 class="text-5xl font-bold">Sección 4</h1>
      <p class="mt-4 text-xl">Lorem ipsum</p>
    </FullScreenSection>
  </main>
</template>
