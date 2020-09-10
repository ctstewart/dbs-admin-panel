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
			:items="users"
			:items-per-page="10"
			class="elevation-1"
		>
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Users</v-toolbar-title>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
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
									></v-text-field>
									<v-text-field
										label="Last Name"
										placeholder="Doe"
									></v-text-field>
									<v-text-field
										label="Email"
										placeholder="jdoe"
										suffix="@wirelessworld.com"
									></v-text-field>
									<v-autocomplete
										label="Store"
										placeholder="Owatonna North"
										:items="stores"
									></v-autocomplete>
									<v-autocomplete
										label="District"
										placeholder="Scot Suess"
										:items="districts"
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
			<template v-slot:item.hasSeenNewChanges="{ item }">
				<v-simple-checkbox
					v-model="item.hasSeenNewChanges"
					disabled
				></v-simple-checkbox>
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
			loading: false,
			dialog: false,
			search: '',
			editedIndex: -1,
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
					text: 'Has Seen New Changes',
					sortable: true,
					value: 'hasSeenNewChanges',
				},
				{
					text: 'Actions',
					sortable: false,
					value: 'actions',
				},
			],
			users: [
				{
					firstName: 'Christian',
					lastName: 'Stewart',
					email: 'cstewart@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
				{
					firstName: 'Elijah',
					lastName: 'Chapple',
					email: 'echapple@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
				{
					firstName: 'Jennifer',
					lastName: 'Richter',
					email: 'jrichter@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
				{
					firstName: 'Kelsey',
					lastName: 'Quint',
					email: 'kquint@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
				{
					firstName: 'Pete',
					lastName: 'Jensen',
					email: 'pjensen@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
				{
					firstName: 'Jake',
					lastName: 'Larson',
					email: 'jlarson@wirelessworld.com',
					store: 'Owatonna North',
					district: 'Scot Suess',
					hasSeenNewChanges: true,
				},
			],
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

	computed: {
		formTitle() {
			return this.editedIndex === -1 ? 'New User' : 'Edit User'
		},
	},

	methods: {
		// editUser(user) {
		// 	this.dialog = true
		// },
		// deleteUser(user) {
		// 	alert('Are you sure?')
		// },
		save() {
			this.dialog = false
		},
		close() {
			this.dialog = false
		},
	},

	// async mounted() {
	// 	const token = localStorage.getItem('token')
	// 	const response = await axios({
	// 		method: 'get',
	// 		// url:
	// 		// 	'/api/users/adminGetAllUsers' +
	// 		// 	'?nocache=' +
	// 		// 	new Date().getTime(), // Safari fix
	// 		url: '/api/users/adminGetAllUsers',
	// 		headers: { authorization: `Bearer ${token}` },
	// 	})
	// 	this.users = response.data.users
	// 	this.loading = false
	// },
}
</script>
