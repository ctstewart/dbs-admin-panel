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
				:items="users"
				:items-per-page="10"
				class="elevation-1"
				:search="search"
			>
				<template v-slot:top>
					<v-toolbar flat>
						<!-- <v-toolbar-title>Users</v-toolbar-title> -->
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
									>New User</v-btn
								>
							</template>
							<v-card>
								<v-card-title>
									<span class="headline">{{ formTitle }}</span>
								</v-card-title>

								<v-card-text>
									<v-container>
										<v-text-field
											label="First Name"
											placeholder="John"
											v-model="user.firstName"
										></v-text-field>
										<v-text-field
											label="Last Name"
											placeholder="Doe"
											v-model="user.lastName"
										></v-text-field>
										<v-text-field
											label="Email"
											placeholder="jdoe"
											:suffix="emailSuffix"
											v-model="emailSplit"
										></v-text-field>
										<v-autocomplete
											label="Store"
											placeholder="Owatonna North"
											:items="stores"
											v-model="user.store"
										></v-autocomplete>
										<v-autocomplete
											label="District"
											placeholder="Scot Suess"
											:items="districts"
											v-model="user.district"
										></v-autocomplete>
									</v-container>
								</v-card-text>

								<v-card-actions>
									<v-spacer></v-spacer>
									<v-btn color="indigo" text @click="closeForm"
										>Cancel</v-btn
									>
									<v-btn color="indigo" text @click="editedIndex === -1 ? axiosCreateUser() : axiosUpdateUser(user._id)"
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
									<v-btn color="blue darken-1" text @click="axiosDeleteUser(user._id)">OK</v-btn>
									<v-spacer></v-spacer>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-toolbar>
				</template>
				<template v-slot:[`item.actions`]="{ item }">
					<v-icon dense class="mr-4" @click="openEditUser(item)">
						mdi-pencil
					</v-icon>
					<v-icon dense @click="openDeleteUser(item)">
						mdi-delete
					</v-icon>
				</template>
				<!-- <template v-slot:[`item.hasSeenNewChanges`]="{ item }">
					<v-simple-checkbox
						v-model="item.hasSeenNewChanges"
						disabled
					></v-simple-checkbox>
				</template> -->
			</v-data-table>
		</v-card>
		<div class="text-center">
			<v-snackbar	v-model="snackbar.active">
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
	name: 'Users',

	components: { AppBar },

	data() {
		return {
			dialogForm: false,
			search: '',
			editedIndex: -1,
			loading: true,
			dialogDelete: false,
			emailSuffix: process.env.VUE_APP_EMAIL_DOMAIN,
			snackbar: {
				active: false,
				message: null
			},
			user: {
				firstName: null,
				lastName: null,
				email: null,
				store: null,
				district: null,
			},
			defaultUser: {
				firstName: null,
				lastName: null,
				email: null,
				store: null,
				district: null,
			},
			headers: [
				{
					text: 'First Name',
					sortable: true,
					value: 'firstName',
				},
				{
					text: 'Last Name',
					sortable: true,
					value: 'lastName',
				},
				{
					text: 'Email',
					sortable: true,
					value: 'email',
				},
				{
					text: 'Store',
					sortable: true,
					value: 'store',
				},
				{
					text: 'District',
					sortable: true,
					value: 'district',
				},
				{
					text: 'Role',
					sortable: true,
					value: 'role'
				},
				{
					text: 'Actions',
					sortable: false,
					value: 'actions',
				},
			],
			users: [],
			stores: [
				'Admin Staff',
				'Business Rep',
				'Aberdeen',
				'Albert Lea',
				'Ankeny',
				'Atlantic',
				'Aurora',
				'Brookings',
				'Chadron',
				'Chamberlain',
				'Cherokee',
				'Cottage Grove',
				'Denison',
				'East Sioux Falls',
				'Edgerton',
				'Fairmont',
				'Faribault',
				'Hamilton',
				'Hastings NE',
				'Le Mars',
				'Lexington',
				'Lincoln',
				'Madison',
				'McCook',
				'Monticello',
				'Morningside',
				'Northfield',
				'Onawa',
				'Ord',
				'Owatonna North',
				'Owatonna South',
				'Plymouth',
				'Red Wing',
				'River Falls',
				'Rock Valley',
				'Sartell',
				'Sidney',
				'Sioux Center',
				'South Sioux Falls',
				'St. Anthony',
				'Storm Lake',
				'Vermillion',
				'Waseca',
				'West Sioux Falls',
				'Willmar',
				'Worthington',
				'Yankton',
			],
			districts: [
				'Admin Staff',
				'Aaron Stickney',
				'Adam Harrington',
				'Brooke Samuelson',
				'Chelsea Cahoy',
				'Jason Hansen',
				'Kyle Kortz',
				'Marcus Malcom',
				'Matt De Wit',
				'Scot Suess',
			],
		}
	},

	async created() {
		try {
			await this.axiosGetUsers()
			this.loading = false
		} catch (err) {
			console.error(err)
		}
	},

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New User' : 'Edit User'
		},
		emailSplit: {
			get() {
				if (this.user.email) {
					return this.user.email.split('@')[0]
				} else {
					return null
				}
			},
			set(newValue) {
				this.user.email = newValue + process.env.VUE_APP_EMAIL_DOMAIN
			}
		}
	},

	methods: {
		async axiosGetUsers () {
			try {
				const response = await axios({
					method: 'get',
					url: `${process.env.VUE_APP_API_URL}/api/v1/users`,
					withCredentials: true,
					params: {
						limit: 1000
					}
				})

				this.users = response.data.data
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosCreateUser () {
			try {
				await axios({
					method: 'post',
					url: `${process.env.VUE_APP_API_URL}/api/v1/users`,
					withCredentials: true,
					data: {
						firstName: this.user.firstName,
						lastName: this.user.lastName,
						email: this.user.email,
						password: 'WirelessWorldRocks!',
						store: this.user.store,
						district: this.user.district
					}
				})

				this.axiosGetUsers()
				this.closeForm()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosUpdateUser (userId) {
			try {
				await axios({
					method: 'put',
					url: `${process.env.VUE_APP_API_URL}/api/v1/users/${userId}`,
					withCredentials: true,
					data: this.user
				})

				this.axiosGetUsers()
				this.closeForm()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
		},
		async axiosDeleteUser (userId) {
			try {
				await axios({
					method: 'delete',
					url: `${process.env.VUE_APP_API_URL}/api/v1/users/${userId}`,
					withCredentials: true
				})

				this.axiosGetUsers()
				this.closeDelete()
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)			
			}
		},
		openEditUser (user) {
			this.editedIndex = this.users.indexOf(user)
			this.user = Object.assign({}, user)
			this.dialogForm = true
		},
		openDeleteUser (user) {
			this.editedIndex = this.users.indexOf(user)
			this.user = Object.assign({}, user)
			this.dialogDelete = true
		},
		closeDelete () {
			this.dialogDelete = false
			this.$nextTick(() => {
				this.user = Object.assign({}, this.defaultUser)
				this.editedIndex = -1
			})
		},
		closeForm () {
			this.dialogForm = false
			this.$nextTick(() => {
				this.user = Object.assign({}, this.defaultUser)
				this.editedIndex = -1
			})
		},
		openSnackbar (message) {
			this.snackbar.message = message
			this.snackbar.active = true
		},
		closeSnackbar () {
			this.snackbar.active = false
			this.snackbar.message = null
		}
	},
}
</script>
