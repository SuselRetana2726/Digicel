import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Memory from '../components/Memory.vue'
import Final from '../views/Final.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/juego/',
    name: 'Juego',
    component: Memory,
    props: true
  },
  {
    path: '/final/',
    name: 'Final',
    component: Final,
    props: true
  }
]

const router = createRouter({
  history: createWebHashHistory(), // Ideal para GitHub Pages
  routes
})

export default router