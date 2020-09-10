<template>
	<div>
		<v-app-bar color="indigo" dark elevate-on-scroll>
			<v-toolbar-title color="white">Admin Bar</v-toolbar-title>
			<v-spacer></v-spacer>
			<!-- <v-btn icon>
				<v-icon>mdi-dots-vertical</v-icon>
			</v-btn> -->

			<v-menu left bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item v-for="n in 5" :key="n" @click="() => {}">
						<v-list-item-title>Option {{ n }}</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>

			<template v-slot:extension>
				<v-tabs align-with-title>
					<v-tab to="/users">Users</v-tab>
					<v-tab to="/devices">Devices</v-tab>
					<!-- <v-tab>Tab 3</v-tab> -->
				</v-tabs>
			</template>
		</v-app-bar>
	</div>
</template>

<script>
export default {
	data() {
		return {
			items: [{ title: 'test' }],
		}
	},
}
</script>

<style></style>
