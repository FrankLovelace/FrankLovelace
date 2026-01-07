<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="min-h-screen bg-black text-white p-8">
    <nav class="mb-8">
      <RouterLink to="/" class="flex items-center text-blue-400 hover:text-blue-300 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Volver al Inicio
      </RouterLink>
    </nav>

    <h1 class="text-4xl font-bold mb-4">Galaxia Completa de Proyectos</h1>
    <p>Aquí irá la lista detallada de todos mis trabajos.</p>

    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div class="h-64 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center">
            <span class="text-gray-600">Espacio para Proyecto 1</span>
        </div>
        <div class="h-64 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center">
            <span class="text-gray-600">Espacio para Proyecto 2</span>
        </div>
        <div class="h-64 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center">
            <span class="text-gray-600">Espacio para Proyecto 3</span>
        </div>
    </div>
  </div>
</template>
