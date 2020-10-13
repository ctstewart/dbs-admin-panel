<template>
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
										v-model="createDevice.name"
									></v-text-field>
									<v-text-field
										label="Full Retail"
										placeholder="710.00"
										prefix="$"
										v-model="createDevice.fullRetail"
									></v-text-field>
									<v-autocomplete
										label="Manufacturer"
										placeholder="Apple"
										:items="manufacturers"
										v-model="createDevice.manufacturer"
									></v-autocomplete>
									<v-autocomplete
										label="Storage Capacity"
										placeholder="64GB"
										:items="storageCapacities"
										v-model="createDevice.storageCapacity"
									></v-autocomplete>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="indigo" text @click="close"
									>Cancel</v-btn
								>
								<v-btn color="indigo" text @click="axiosCreateDevice"
									>Save</v-btn
								>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="headline">Are you sure you want to delete this?</v-card-title>
							<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
							<v-btn color="blue darken-1" text @click="axiosDeleteDevice(editedDevice._id)">OK</v-btn>
							<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-icon dense class="mr-4" @click="editDevice(item)">
					mdi-pencil
				</v-icon>
				<v-icon dense @click="openDeleteDevice(item)">
					mdi-delete
				</v-icon>
			</template>
		</v-data-table>
	</v-card>
</template>

<script>
import axios from 'axios'

export default {
	name: 'Home',

	components: {},

	data() {
		return {
			dialog: false,
			search: '',
			editedIndex: -1,
			loading: true,
			dialogDelete: false,
			createDevice: {
				name: null,
				manufacturer: null,
				fullRetail: null,
				storageCapacity: null
			},
			editedDevice: {
				name: null,
				manufacturer: null,
				fullRetail: null,
				storageCapacity: null
			},
			defaultDevice: {
				name: null,
				manufacturer: null,
				fullRetail: null,
				storageCapacity: null
			},
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
			devices: [],
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
	},

	methods: {
		async axiosGetDevices() {
			try {
				const response = await axios({
					method: 'get',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices`,
					withCredentials: true,
					params: {
						limit: 1000
					}
				})

				this.devices = response.data.data
			} catch (err) {
				console.error(err)
			}
		},
		async axiosCreateDevice() {
			try {
				await axios({
					method: 'post',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices`,
					withCredentials: true,
					data: this.createDevice
				})

				this.axiosGetDevices()
				this.dialog = false
			} catch (err) {
				console.error(err)
			}
		},
		async axiosDeleteDevice(deviceId) {
			try {
				await axios({
					method: 'delete',
					url: `${process.env.VUE_APP_API_URL}/api/v1/devices/${deviceId}`,
					withCredentials: true
				})

				this.axiosGetDevices()
				this.closeDelete()
			} catch (err) {
				console.error(err)
			}
		},
		openDeleteDevice (device) {
			this.editedIndex = this.devices.indexOf(device)
			this.editedDevice = Object.assign({}, device)
			this.dialogDelete = true
		},
		closeDelete () {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.editedItem = Object.assign({}, this.defaultItem)
				this.editedIndex = -1
			})
		},
		close() {
			this.dialog = false
		},
	},
}
</script>
