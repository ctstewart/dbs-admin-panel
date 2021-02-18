<template>
	<div>
		<app-bar />
		<v-card>
			<v-data-table
				v-if="loading"
				item-key="name"
				class="elevation-1"
				loading
				loading-text="Loading... Please wait"
			></v-data-table>
			<v-data-table
				v-else
				:headers="headers"
				:items="devices"
				:items-per-page="10"
				class="elevation-1"
				:search="search"
			>
				<template v-slot:[`item.fullRetail`]="{ item }">
					${{ item.fullRetail / 100 }}
				</template>

				<template v-slot:[`item.dppLength`]="{ item }">
					{{ item.dppLength.join(', ') }} months
				</template>

				<template v-slot:top>
					<v-toolbar flat>
						<!-- <v-toolbar-title>Devices</v-toolbar-title> -->
						<!-- <v-divider
							class="mx-4"
							inset
							vertical
						></v-divider> -->
						<v-text-field
							v-model="search"
							append-icon="mdi-magnify"
							label="Search"
							single-line
							hide-details
						></v-text-field>
						<v-spacer></v-spacer>
						<v-dialog v-model="dialogForm" max-width="500px">
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
									<span class="headline">{{
										formTitle
									}}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-text-field
											label="Name (must be unique)"
											placeholder="iPhone 11 64GB"
											v-model="device.name"
										></v-text-field>
										<v-autocomplete
											label="Category"
											placeholder="Phone"
											:items="categories"
											v-model="device.category"
										></v-autocomplete>
										<v-text-field
											label="Full Retail"
											placeholder="710.00"
											prefix="$"
											v-model="fullRetailModified"
										></v-text-field>
										<v-autocomplete
											label="Manufacturer"
											placeholder="Apple"
											:items="manufacturers"
											v-model="device.manufacturer"
										></v-autocomplete>
										<v-autocomplete
											label="Storage Capacity"
											placeholder="64GB"
											:items="storageCapacities"
											v-model="device.storageCapacity"
										></v-autocomplete>
										<v-autocomplete
											multiple
											label="DPP Options"
											placeholder="24"
											:items="dppLengthOptions"
											v-model="device.dppLength"
											suffix="Months"
										></v-autocomplete>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										color="indigo"
										text
										@click="closeForm"
										>Cancel</v-btn
									>
									<v-btn
										color="indigo"
										text
										@click="
											editedIndex === -1
												? axiosCreateDevice()
												: axiosUpdateDevice(device._id)
										"
										>Save</v-btn
									>
								</v-card-actions>
							</v-card>
						</v-dialog>
						<v-dialog v-model="dialogDelete" max-width="500px">
							<v-card>
								<v-card-title class="headline"
									>Are you sure you want to delete
									this?</v-card-title
								>
								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn
										color="blue darken-1"
										text
										@click="closeDelete"
										>Cancel</v-btn
									>
									<v-btn
										color="blue darken-1"
										text
										@click="axiosDeleteDevice(device._id)"
										>OK</v-btn
									>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-toolbar>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon dense class="mr-4" @click="openEditDevice(item)">
						mdi-pencil
					</v-icon>
					<v-icon dense @click="openDeleteDevice(item)">
						mdi-delete
					</v-icon>
				</template>
			</v-data-table>
		</v-card>
		<div class="text-center">
			<v-snackbar v-model="snackbar.active">
				{{ snackbar.message }}
				<template v-slot:action="{ attrs }">
					<v-btn
						color="red"
						text
						v-bind="attrs"
						@click="snackbar.active = false"
					>
						Close
					</v-btn>
				</template>
			</v-snackbar>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

import AppBar from '../components/AppBar'

export default {
	name: 'Devices',

	components: { AppBar },

	data() {
		return {
			dialogForm: false,
			search: '',
			editedIndex: -1,
			loading: true,
			dialogDelete: false,
			snackbar: {
				active: false,
				message: null,
			},
			device: {
				name: null,
				manufacturer: null,
				fullRetail: null,
				storageCapacity: null,
				category: null,
				dppLength: []
			},
			defaultDevice: {
				name: null,
				manufacturer: null,
				fullRetail: null,
				storageCapacity: null,
				category: null,
				dppLength: []
			},
			headers: [
				{
					text: 'Name',
					sortable: true,
					value: 'name',
				},
				{
					text: 'Category',
					sortable: true,
					value: 'category'
				},
				{
					text: 'Manufacturer',
					sortable: true,
					value: 'manufacturer',
				},
				{
					text: 'Full Retail',
					sortable: true,
					value: 'fullRetail',
				},
				{
					text: 'Storage',
					sortable: true,
					value: 'storageCapacity',
				},
				{
					text: 'DPP Length',
					sortable: false,
					value: 'dppLength'
				},
				{
					text: 'Actions',
					sortable: false,
					value: 'actions',
				},
			],
			devices: [],
			manufacturers: [
				'Apple',
				'Samsung',
				'Verizon',
				'Motorola',
				'LG',
				'Kyocera',
				'Google',
				'Alcatel',
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
			categories: [
				'Phone',
				'Tablet',
				'Smartwatch',
				'Other'
			],
			dppLengthOptions: [ 24, 30 ]
		}
	},

	async created() {
		try {
			await this.axiosGetDevices()
			this.loading = false
		} catch (err) {
			console.error(err)
		}
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New Device' : 'Edit Device'
		},
		fullRetailModified: {
			get() {
				if (this.device.fullRetail) {
					return this.device.fullRetail / 100
				} else {
					return null
				}
			},
			set(newValue) {
				this.device.fullRetail = newValue * 100
			}
		}
	},

	methods: {
		async axiosGetDevices() {
			try {
				const response = await axios({
					method: 'get',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices`,
					withCredentials: true,
					params: {
						limit: 1000,
					},
				})

				this.devices = response.data.data
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosCreateDevice() {
			try {
				await axios({
					method: 'post',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices`,
					withCredentials: true,
					data: this.device,
				})

				this.axiosGetDevices()
				this.closeForm()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosUpdateDevice(deviceId) {
			try {
				await axios({
					method: 'put',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices/${deviceId}`,
					withCredentials: true,
					data: this.device,
				})

				this.axiosGetDevices()
				this.closeForm()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosDeleteDevice(deviceId) {
			try {
				await axios({
					method: 'delete',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices/${deviceId}`,
					withCredentials: true,
				})

				this.axiosGetDevices()
				this.closeDelete()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		openEditDevice(device) {
			this.editedIndex = this.devices.indexOf(device)
			this.device = Object.assign({}, device)
			this.dialogForm = true
		},
		openDeleteDevice(device) {
			this.editedIndex = this.devices.indexOf(device)
			this.device = Object.assign({}, device)
			this.dialogDelete = true
		},
		closeDelete() {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.device = Object.assign({}, this.defaultDevice)
				this.editedIndex = -1
			})
		},
		closeForm() {
			this.dialogForm = false
			this.$nextTick(() => {
				this.device = Object.assign({}, this.defaultDevice)
				this.editedIndex = -1
			})
		},
		openSnackbar(message) {
			this.snackbar.message = message
			this.snackbar.active = true
		},
		closeSnackbar() {
			this.snackbar.active = false
			this.snackbar.message = null
		},
	},
}
</script>
