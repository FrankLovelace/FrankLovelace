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

const projects = projectsData;

// ---INTERFAZ ---
const activeTab = ref<'featured' | 'all'>('featured');
const selectedProject = ref<any>(null);

const filteredProjects = computed(() => {
  if (activeTab.value === 'featured') {
    return projects.filter((p: any) => p.featured);
  }
  return projects;
});

const openModal = (project: any) => {
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
