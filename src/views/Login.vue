<template>
	<v-container>
		<v-card>
			<v-card-title color="indigo">Login</v-card-title>
			<v-card-text>
				<v-text-field v-model="email" label="Email" suffix="@wirelessworld.com" outlined></v-text-field>
				<v-text-field v-model="password" label="Password" :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'" :type="showPass ? 'text' : 'password'" @click:append="showPass = !showPass" outlined></v-text-field>
				<v-btn depressed color="indigo" dark @click="axiosLogin">Login</v-btn>
			</v-card-text>
		</v-card>
	</v-container>

</template>

<script>
import axios from 'axios'

export default {
	name: 'Login',

	data: () => ({
		email: '',
		password: '',
		showPass: false
	}),

	methods: {
		async axiosLogin() {
			try {
				const response = await axios({
					method: 'post',
					url: `${process.env.VUE_APP_API_URL}/api/v1/auth/login`,
					withCredentials: true,
					data: {
						email: this.email + '@gmail.com',
						password: this.password
					}
				})			

				if (response.data.success !== true) {
					console.log(response)
				} else {
					this.$router.push('/')
				}

			} catch (err) {
				console.error(err)
			}
		}
	}
}
</script>