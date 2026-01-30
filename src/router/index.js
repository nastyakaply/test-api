import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RegistrView from '@/views/RegistrView.vue'
import AuthoView from '@/views/AuthoView.vue'

const routes = [{
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/register',
        name: 'register',
        component: RegistrView
    },
    {
        path: '/auth',
        name: 'auth',
        component: AuthoView
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router