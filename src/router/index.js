import Vue from 'vue'
import VueRouter from 'vue-router'
import Devices from '../views/Devices.vue'

import { authGuard } from '../auth/authGuard'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Devices,
		beforeEnter: authGuard,
	},
	{
		path: '/devices',
		name: 'Devices',
		component: Devices,
		beforeEnter: authGuard,
	},
]

const router = new VueRouter({
	routes,
})

export default router
