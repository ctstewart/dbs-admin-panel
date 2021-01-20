import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import Users from '../views/Users.vue'
import Devices from '../views/Devices.vue'
import Logs from '../views/Logs.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Users,
		meta: { requiresAuth: true }
	},
	{
		path: '/users',
		name: 'Users',
		component: Users,
		meta: { requiresAuth: true }
	},
	{
		path: '/devices',
		name: 'Devices',
		component: Devices,
		meta: { requiresAuth: true }
	},
	{
		path: '/logs',
		name: 'Logs',
		component: Logs,
		meta: { requiresAuth: true }
	},
	{
		path: '/login',
		name: 'Login',
		component: Login,
		meta: { requiresAuth: false }
	}
]

const router = new VueRouter({
	routes,
})

router.beforeEach(async (to, from, next) => {
	if (to.meta.requiresAuth) {
		try {
			const response = await axios({
				method: 'get',
				url: `${process.env.VUE_APP_API_URL}/api/v1/auth/me`,
				withCredentials: true,
			})

			if (!response || response.data.success === false) {
				if (from.url === '/login') {
					next(false)
				} else {
					router.push('/login')
					next()
				}
			}

			if (response.data.data.role !== 'admin' && response.data.data.role !== 'superadmin') {
				if (from.path === '/login') {
					next(false)
				} else {
					router.push('/login')
					next()
				}
			}

			next()

		} catch (err) {
			console.error(err)
			router.push('/login')
			next()
		}
	} else {
		next()
	}
})

export default router
