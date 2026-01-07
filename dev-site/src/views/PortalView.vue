<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
<template>
  <div class="min-h-screen bg-black flex flex-col items-center justify-center text-white relative overflow-hidden">
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-black to-black animate-pulse"></div>

    <div class="z-10 text-center p-8 border border-purple-500/30 bg-black/50 backdrop-blur-md rounded-2xl max-w-2xl">
      <h1 class="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-6">
        PORTAL
      </h1>
      <p class="text-xl text-gray-300 mb-10">
        Lorem ipsum
      </p>

      <div class="flex flex-col md:flex-row gap-6 justify-center">
        <a href="https://me.franklovelace.dev" class="px-8 py-4 bg-gray-800 hover:bg-cyan-900 border border-cyan-700 rounded-lg transition-all">
            Ir al Blog (@ME)
        </a>
        <a href="https://art.franklovelace.dev" class="px-8 py-4 bg-gray-800 hover:bg-purple-900 border border-purple-700 rounded-lg transition-all">
            Ir al Arte (@ART)
        </a>
      </div>

      <div class="mt-12">
        <RouterLink to="/" class="text-gray-500 hover:text-white underline">Volver al espacio</RouterLink>
      </div>
    </div>
  </div>
</template>
