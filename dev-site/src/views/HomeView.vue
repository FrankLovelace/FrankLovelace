<script setup lang="ts">
import { onMounted } from 'vue';
import FullScreenSection from '@/components/FullScreenSection.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import TheEarth from '@/components/TheEarth.vue';

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
    <FullScreenSection class="panel bg-gray-900 z-0 relative overflow-hidden">

      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black opacity-80"></div>

      <div class="relative z-10 max-w-4xl px-6 flex flex-col items-center text-center">

        <h1 class="text-6xl md:text-8xl font-bold tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          I'm Frank Lovelace
        </h1>

        <p class="text-gray-400 text-sm md:text-base mb-8 uppercase tracking-widest">
          I'm a Software Developer, martial artist, writter and gamer
        </p>

        <p class="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl font-light mb-10">
          "We are shaped by our material conditions and social context, the rest is luck and a binch of sugar"
        </p>

        <div class="flex space-x-6">
          <a href="https://github.com/FrankLovelace" target="_blank" class="group relative p-4 bg-gray-800 rounded-full hover:bg-gray-700 transition-all duration-300 border border-gray-700 hover:border-white/50">
            <div class="absolute inset-0 bg-white/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="w-8 h-8 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd" />
            </svg>
          </a>

          <a href="https://www.instagram.com/franklovegood/" target="_blank" class="group relative p-4 bg-gray-800 rounded-full hover:bg-pink-900 transition-all duration-300 border border-gray-700 hover:border-pink-500">
             <div class="absolute inset-0 bg-pink-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <svg class="w-8 h-8 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
              <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.46 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" />
            </svg>
          </a>

          <a href="https://www.linkedin.com/in/francisco-alexandro-gallegos-vidales-9a8145358/" class="group relative p-4 bg-gray-800 rounded-full hover:bg-blue-900 transition-all duration-300 border border-gray-700 hover:border-blue-500">
             <div class="absolute inset-0 bg-blue-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
             <svg class="w-8 h-8 text-white relative z-10" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
             </svg>
          </a>

        </div>

        <div class="absolute bottom-10 animate-bounce">
            <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        </div>

      </div>
    </FullScreenSection>

    <FullScreenSection class="panel bg-black z-10 relative overflow-hidden">

      <div class="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-indigo-900 via-black to-black opacity-90"></div>
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute top-40 left-20 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style="animation-delay: 2s"></div>

      <div class="relative z-10 max-w-6xl w-full px-6">

        <div class="text-center mb-12">
          <h2 class="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-4">
            Galaxia de Proyectos
          </h2>
          <p class="text-gray-400 text-lg">Explora algunos de mis sistemas desplegados.</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

          <RouterLink to="/proyectos" class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div class="h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all">
              <span class="text-4xl"></span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">primero</h3>
            <p class="text-gray-400 text-sm">Lorem ipsum</p>
            <div class="mt-4 flex gap-2">
              <span class="text-xs py-1 px-2 rounded-full bg-blue-900/50 text-blue-200 border border-blue-700">lorem</span>
            </div>
          </RouterLink>

          <RouterLink to="/proyectos" class="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 cursor-pointer">
            <div class="h-40 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl mb-4 flex items-center justify-center group-hover:from-emerald-500/30 group-hover:to-teal-500/30 transition-all">
              <span class="text-4xl"></span>
            </div>
            <h3 class="text-2xl font-bold text-white mb-2">Segundo</h3>
            <p class="text-gray-400 text-sm">Lorem ipsum</p>
            <div class="mt-4 flex gap-2">
              <span class="text-xs py-1 px-2 rounded-full bg-emerald-900/50 text-emerald-200 border border-emerald-700">Lorem</span>
            </div>
          </RouterLink>

           <RouterLink to="/proyectos" class="group relative bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:border-blue-400 transition-all duration-300 cursor-pointer">
            <div class="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center mb-4 shadow-lg shadow-blue-900/50 group-hover:scale-110 transition-transform">
               <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </div>
            <h3 class="text-2xl font-bold text-white group-hover:text-blue-300 transition-colors">Ver Galería Completa</h3>
            <p class="text-gray-400 text-sm mt-2">Explora mis proyectos en detalle</p>
          </RouterLink>

        </div>
      </div>
    </FullScreenSection>

    <FullScreenSection class="panel bg-black z-20 relative overflow-hidden">
      <TheEarth />

      <div class="absolute bottom-10 left-0 w-full text-center pointer-events-none z-30">
        <p class="text-cyan-200/50 text-sm tracking-[0.3em] uppercase animate-pulse">
            Arrastra para explorar • Haz clic para entrar al Portal
        </p>
      </div>
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
