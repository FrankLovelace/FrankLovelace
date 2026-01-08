<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { ref } from 'vue';

const meImage = "images/me.jpeg";
const artImage = "images/art.jpeg";

const hoverSide = ref<'none' | 'me' | 'art'>('none');
</script>

<template>
  <div class="relative w-full h-screen bg-black overflow-hidden">

    <a
      href="https://art.franklovelace.dev"
      target="_blank"
      class="absolute inset-0 w-full h-full group clip-path-art z-10"
      @mouseenter="hoverSide = 'art'"
      @mouseleave="hoverSide = 'none'"
    >
      <div class="absolute inset-0 overflow-hidden bg-gray-900">
        <img
          :src="artImage"
          alt="Artistic Side"
          class="w-full h-full object-cover transition-all duration-700 ease-in-out filter grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
      </div>

      <div class="absolute top-[20%] right-[15%] text-right pointer-events-none">
        <h2 class="text-7xl md:text-9xl font-bold text-transparent text-stroke-white group-hover:text-purple-500 transition-colors duration-500">
          ART
        </h2>
        <p class="text-white font-mono tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-10 group-hover:translate-x-0">
          LITERATURA & CREATIVIDAD
        </p>
      </div>
    </a>

    <a
      href="https://me.franklovelace.dev"
      target="_blank"
      class="absolute inset-0 w-full h-full group clip-path-me z-10"
      @mouseenter="hoverSide = 'me'"
      @mouseleave="hoverSide = 'none'"
    >
      <div class="absolute inset-0 overflow-hidden bg-gray-900">
        <img
          :src="meImage"
          alt="Professional Side"
          class="w-full h-full object-cover transition-all duration-700 ease-in-out filter grayscale group-hover:grayscale-0 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
      </div>

      <div class="absolute bottom-[20%] left-[10%] pointer-events-none">
        <h2 class="text-7xl md:text-9xl font-bold text-transparent text-stroke-white group-hover:text-cyan-500 transition-colors duration-500">
          ME
        </h2>
        <p class="text-white font-mono tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-10 group-hover:translate-x-0">
          BLOG PERSONAL & VIDA
        </p>
      </div>
    </a>
    <div class="absolute inset-0 pointer-events-none z-20">
        <svg class="w-full h-full" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="100%" y2="100%" stroke="white" stroke-width="2" class="opacity-20" />
        </svg>
    </div>

    <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
      <RouterLink
        to="/"
        class="group/btn relative flex items-center justify-center w-20 h-20 bg-black border-2 border-white rounded-full hover:scale-110 hover:border-cyan-400 transition-all duration-300 shadow-[0_0_30px_rgba(0,0,0,0.8)]"
      >
        <svg
          class="w-8 h-8 text-white group-hover/btn:text-cyan-400 transition-colors transform group-hover/btn:-rotate-90 duration-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>

        <span class="absolute -bottom-8 text-xs font-bold text-white opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap">
          VOLVER
        </span>
      </RouterLink>
    </div>

  </div>
</template>

<style scoped>

.clip-path-art {
  clip-path: polygon(0 0, 100% 0, 100% 100%);
}


.clip-path-me {

  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.text-stroke-white {
  -webkit-text-stroke: 2px white;
  color: transparent;
}
</style>
