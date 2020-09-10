<template>
	<v-card>
		<v-data-table
			:headers="headers"
			:items="devices"
			:items-per-page="10"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Devices</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn
								color="indigo"
								dark
								class="mb-2"
								v-bind="attrs"
								v-on="on"
								>New Device</v-btn
							>
						</template>
						<v-card>
							<v-card-title>
								<span class="headline">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-text-field
										label="Name (must be unique)"
										placeholder="iPhone 11 64GB"
									></v-text-field>
									<v-text-field
										label="Full Retail"
										placeholder="710.00"
										prefix="$"
									></v-text-field>
									<v-autocomplete
										label="Manufacturer"
										placeholder="Apple"
										:items="manufacturers"
									></v-autocomplete>
									<v-autocomplete
										label="Storage Capacity"
										placeholder="64GB"
										:items="storageCapacities"
									></v-autocomplete>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="indigo" text @click="close"
									>Cancel</v-btn
								>
								<v-btn color="indigo" text @click="close"
									>Save</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:item.actions="{ user }">
				<v-icon dense class="mr-4" @click="editUser(user)">
					mdi-pencil
				</v-icon>
				<v-icon dense @click="deleteUser(user)">
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
// import axios from 'axios'

export default {
	name: 'Home',

	components: {},

	data() {
		return {
			dialog: false,
			search: '',
			editedIndex: -1,
			headers: [
				{
					text: 'Name',
					sortable: true,
					value: 'name',
				},
				{
					text: 'Storage',
					sortable: true,
					value: 'storageCapacity',
				},
				{
					text: 'Full Retail',
					sortable: true,
					value: 'fullRetail',
				},
				{
					text: 'Manufacturer',
					sortable: true,
					value: 'manufacturer',
				},
				{
					text: 'Actions',
					sortable: false,
					value: 'actions',
				},
			],
			devices: [
				{
					name: 'iPhone 11 64GB',
					storageCapacity: '64GB',
					fullRetail: `$${String((71000 / 100).toFixed(2))}`,
					manufacturer: 'Apple',
				},
				{
					name: 'iPhone 11 128GB',
					storageCapacity: '128GB',
					fullRetail: `$${String((76000 / 100).toFixed(2))}`,
					manufacturer: 'Apple',
				},
				{
					name: 'iPhone 11 256GB',
					storageCapacity: '256GB',
					fullRetail: `$${String((86000 / 100).toFixed(2))}`,
					manufacturer: 'Apple',
				},
			],
			manufacturers: [
				'Apple',
				'Samsung',
				'Motorola',
				'Kyocera',
				'LG',
				'Verizon',
			],
			storageCapacities: [
				'N/A',
				'16GB',
				'32GB',
				'64GB',
				'128GB',
				'256GB',
				'512GB',
				'1TB',
			],
		}
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New Device' : 'Edit Device'
		},
	},

	methods: {
		save() {
			this.dialog = false
		},
		close() {
			this.dialog = false
		},
	},

	// async created() {
	// 	const token = localStorage.getItem('token')
	// 	const response = await axios({
	// 		method: 'get',
	// 		url: '/api/users/adminGetAllUsers',
	// 		headers: { authorization: `Bearer ${token}` },
	// 	})
	// 	this.devices = response.data.users
	// 	this.loading = false
	// },
}
</script>
