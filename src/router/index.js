import Vue from 'vue'
import VueRouter from 'vue-router'
import Users from '../views/Users.vue'
import Devices from '../views/Devices.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Users,
	},
	{
		path: '/users',
		name: 'Users',
		component: Users,
	},
	{
		path: '/devices',
		name: 'Devices',
		component: Devices,
	},
]

const router = new VueRouter({
	routes,
})

export default router
