<script setup lang="ts">
import { ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import projectsData from '@/data/projects.json';

const getTechStyle = (tech: string) => {
  const t = tech.toLowerCase();

  // GRUPO 1: CLOUD & DEVOPS
  if (t.includes('azure') || t.includes('docker') || t.includes('github') || t.includes('nginx') || t.includes('linux') || t.includes('ubuntu') || t.includes('cloudflare') || t.includes('devops')) {
    return 'bg-orange-900/50 text-orange-200 border-orange-700';
  }

  // GRUPO 2: DATA & SECURITY
  if (t.includes('sql') || t.includes('data') || t.includes('jwt') || t.includes('auth') || t.includes('identity') || t.includes('rbac') || t.includes('ssh') || t.includes('security')) {
    return 'bg-purple-900/50 text-purple-200 border-purple-700';
  }

  // GRUPO 3: FRONTEND & UX
  if (t.includes('vue') || t.includes('script') || t.includes('js') || t.includes('tailwind') || t.includes('vite') || t.includes('pinia') || t.includes('apex') || t.includes('signalr') || t.includes('front')) {
    return 'bg-emerald-900/50 text-emerald-200 border-emerald-700';
  }

  //BACKEND & LOGIC
  if (t.includes('c#') || t.includes('.net') || t.includes('java') || t.includes('entity') || t.includes('blazor') || t.includes('linq') || t.includes('rest') || t.includes('velocity') || t.includes('papermc') || t.includes('back')) {
    return 'bg-blue-900/50 text-blue-200 border-blue-700';
  }

  // Default
  return 'bg-gray-800 text-gray-300 border-gray-600';
};

interface Project {
  id: string | number;
  title: string;
  shortDesc: string;
  fullDescription: string;
  images: string[];
  technologies: string[];
  isPublic: boolean;
  featured: boolean;
  repoLink?: string;
}

const projects = projectsData as Project[];

// ---INTERFAZ ---
const activeTab = ref<'featured' | 'all'>('all');
const selectedProject = ref<Project | null>(null);

const filteredProjects = computed(() => {
  if (activeTab.value === 'featured') {
    return projects.filter((p) => p.featured);
  }
  return projects;
});

const openModal = (project: Project) => {
  selectedProject.value = project;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedProject.value = null;
  document.body.style.overflow = 'auto';
};
</script>



<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>


<template>
  <div class="min-h-screen bg-black text-white p-6 md:p-12 font-sans relative">
    <header class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16">
      <div class="mb-6 md:mb-0">
        <RouterLink to="/" class="flex items-center text-gray-400 hover:text-white transition-colors mb-2">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Volver al Inicio
        </RouterLink>
        <h1 class="text-4xl md:text-5xl font-bold">Mis Proyectos</h1>
      </div>

      <div class="flex space-x-6 border-b border-gray-800 pb-2">

        <button
          @click="activeTab = 'all'"
          class="text-lg font-medium transition-colors relative"
          :class="activeTab === 'all' ? 'text-purple-400' : 'text-gray-500 hover:text-gray-300'"
        >
          Galería Completa
          <div v-if="activeTab === 'all'" class="absolute -bottom-2.5 left-0 w-full h-1 bg-purple-500 rounded-t-full"></div>
        </button>
      </div>
    </header>

    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div
        v-for="project in filteredProjects"
        :key="project.id"
        @click="openModal(project)"
        class="group bg-gray-900/40 border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col"
        >
        <div class="h-48 overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10 opacity-60"></div>
          <img :src="project.images[0]" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

          <div class="absolute top-2 right-2 z-20">
             <span v-if="!project.isPublic" class="bg-black/60 backdrop-blur text-gray-400 text-xs px-2 py-1 rounded border border-gray-700 flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Privado
             </span>
          </div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="flex justify-between items-start mb-2">
            <h3 class="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{{ project.title }}</h3>
          </div>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">{{ project.shortDesc }}</p>

          <div class="flex flex-wrap gap-2 mt-auto">
            <span
              v-for="tech in project.technologies.slice(0, 3)"
              :key="tech"
              class="w-3 h-3 rounded-full"
              :class="getTechStyle(tech).split(' ')[0]?.replace('/50', '')"
              :title="tech"
            ></span>
            <span v-if="project.technologies.length > 3" class="text-xs text-gray-600 self-center">+{{ project.technologies.length - 3 }}</span>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selectedProject" class="fixed inset-0 z-50 flex items-center justify-center p-4">

        <div class="absolute inset-0 bg-black/80 backdrop-blur-md" @click="closeModal"></div>

        <div class="relative bg-gray-900 border border-gray-700 w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-y-auto shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row">

          <button @click="closeModal" class="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/20 rounded-full text-white transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div class="w-full md:w-3/5 bg-black p-4 grid gap-2 overflow-hidden"
               :class="{
                 'grid-cols-1': selectedProject.images.length === 1,
                 'grid-cols-2': selectedProject.images.length === 2,
                 'grid-cols-3': selectedProject.images.length === 3,
                 'grid-cols-4': selectedProject.images.length === 4
               }">

            <img v-if="selectedProject.images.length === 1"
                 :src="selectedProject.images[0]" class="w-full h-full object-cover rounded-lg col-span-1 aspect-video" />

            <template v-if="selectedProject.images.length === 2">
                <img :src="selectedProject.images[0]" class="w-full h-full object-cover rounded-lg col-span-1" />
                <img :src="selectedProject.images[1]" class="w-full h-full object-cover rounded-lg col-span-1" />
            </template>

            <template v-if="selectedProject.images.length === 3">
                <div class="col-span-1 flex flex-col gap-2">
                    <img :src="selectedProject.images[1]" class="w-full h-1/2 object-cover rounded-lg" />
                    <img :src="selectedProject.images[2]" class="w-full h-1/2 object-cover rounded-lg" />
                </div>
                <img :src="selectedProject.images[0]" class="col-span-2 w-full h-full object-cover rounded-lg" />
            </template>

            <template v-if="selectedProject.images.length === 4">
                 <div class="col-span-1 flex flex-col gap-2">
                    <img :src="selectedProject.images[1]" class="w-full h-1/3 object-cover rounded-lg" />
                    <img :src="selectedProject.images[2]" class="w-full h-1/3 object-cover rounded-lg" />
                    <img :src="selectedProject.images[3]" class="w-full h-1/3 object-cover rounded-lg" />
                </div>
                <img :src="selectedProject.images[0]" class="col-span-3 w-full h-full object-cover rounded-lg" />
            </template>

          </div>

          <div class="w-full md:w-2/5 p-8 flex flex-col">
            <h2 class="text-4xl font-bold text-white mb-2">{{ selectedProject.title }}</h2>
            <div class="h-1 w-20 bg-cyan-500 mb-6 rounded-full"></div>

            <p class="text-gray-300 leading-relaxed mb-8 text-sm md:text-base">
              {{ selectedProject.fullDescription }}
            </p>

            <div class="mt-auto">
              <h4 class="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Stack Tecnológico</h4>

              <div class="flex flex-wrap gap-3">
                <span
                  v-for="tech in selectedProject.technologies"
                  :key="tech"
                  class="px-3 py-1 text-sm font-medium border rounded-md transition-all hover:scale-105 cursor-default"
                  :class="getTechStyle(tech)"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div class="mt-8 flex gap-4">

                <a
                  v-if="selectedProject.isPublic"
                  :href="selectedProject.repoLink"
                  target="_blank"
                  class="flex-1 py-3 bg-black border border-gray-700 text-white font-bold rounded flex items-center justify-center gap-2 hover:bg-gray-800 hover:border-white transition-all duration-300 shadow-lg"
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path></svg>
                    Ver Repositorio
                </a>

                <button
                    v-else
                    class="flex-1 py-3 bg-gray-800/50 border border-gray-800 text-gray-500 font-bold rounded cursor-not-allowed flex items-center justify-center gap-2"
                    disabled
                >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    Código Privado
                </button>
            </div>

          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>
