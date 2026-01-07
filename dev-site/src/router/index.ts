import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PortalView from '../views/PortalView.vue'
import projectsView from '../views/ProjectsView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/proyectos',
      name: 'proyectos',
      component: projectsView
    },
    {
      path: '/portal',
      name: 'portal',
      component: PortalView
    }
  ],
})

export default router
