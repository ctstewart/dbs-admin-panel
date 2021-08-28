<template>
	<div>
		<v-app-bar color="indigo" dark elevate-on-scroll>
			<v-toolbar-title color="white">Admin Bar</v-toolbar-title>
			<v-spacer></v-spacer>

			<v-menu left bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item href="/">
						<v-list-item-title>
							Benefit Sheet
						</v-list-item-title>
					</v-list-item>
					<v-list-item @click="axiosLogout">
						<v-list-item-title>
							Logout
						</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>

			<template v-slot:extension>
				<v-tabs align-with-title>
					<v-tab to="/devices">Devices</v-tab>
				</v-tabs>
			</template>
		</v-app-bar>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	data() {
		return {}
	},

	methods: {
		async axiosLogout() {
			try {
				const token = await this.$auth.getTokenSilently()

				await axios({
					method: 'get',
					url: `${process.env.VUE_APP_API_URL}/api/v1/auth/logout`,
					headers: { Authorization: `Bearer ${token}` },
					withCredentials: true,
				})

				this.$router.push('/login')
			} catch (err) {
				console.error(err)
			}
		},
	},
}
</script>

<style></style>
