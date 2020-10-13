<template>
	<div v-if="loading"></div>
	<v-app v-else>
		<app-bar />
		<router-view />
	</v-app>
</template>

<script>
import axios from 'axios'

import AppBar from './components/AppBar'

export default {
	name: 'App',

	components: { AppBar },

	data: () => ({
		loading: true
	}),

	async created() {
		try {
			const response = await axios({
				method: 'get',
				url: `${process.env.VUE_APP_API_URL}/api/v1/auth/me`,
				withCredentials: true,
			})

			if (process.env.NODE_ENV === 'production') {
				if (response.data.data.role !== 'admin' && response.data.data.role !== 'superadmin') {
					window.location = 'https://www.digitalbenefitsheet.com'
				} else {
					this.loading = false
				}
			} else {
				console.log(response.data.data.role)
				this.loading = false
			}

		} catch (err) {
			console.error(err)
		}
	}
}
</script>
