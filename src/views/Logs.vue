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
				:items="logsFiltered"
				:items-per-page="10"
				class="elevation-1"
			>
				<template v-slot:[`item.createdAt`]="{ item }">
					{{ new Date(item.createdAt).toLocaleString('en-US') }}
				</template>

				<template v-slot:top>
					<v-row><v-col></v-col></v-row>
					<v-toolbar flat>
						<v-row m-4>
							<v-col cols="3">
								<v-menu
									ref="menu"
									v-model="menu"
									:close-on-content-click="false"
									:value="dateRangeText"
									transition="scale-transition"
									offset-y
									min-width="290px"
								>
									<template v-slot:activator="{ on, attrs }">
										<v-text-field
											v-model="dateRangeText"
											readonly
											v-bind="attrs"
											v-on="on"
											outlined
											solo
										></v-text-field>
									</template>
									<v-date-picker
										v-model="dates"
										range
										no-title
										scrollable
										@change="axiosGetLogs"
									>
										<v-spacer></v-spacer>
										<v-btn
											text
											color="primary"
											@click="menu = false"
										>
											Done
										</v-btn>
									</v-date-picker>
								</v-menu>
							</v-col>
							<v-col cols="9">
								<v-autocomplete
									chips
									clearable
									deletable-chips
									small-chips
									outlined
									solo
									label="Stores"
									:items="stores"
									v-model="filteredStores"
									multiple
									@change="axiosGetLogs"
								></v-autocomplete>
							</v-col>
						</v-row>
					</v-toolbar>
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
import moment from 'moment'

import AppBar from '../components/AppBar'

export default {
	name: 'Devices',

	components: { AppBar },

	data() {
		return {
			dialogFilters: false,
			loading: true,
			menu: false,
			filteredStores: ["Owatonna North"],
			filteredDistricts: [],
			snackbar: {
				active: false,
				message: null,
			},
			dates: [null, null],
			headers: [
				{
					text: 'First Name',
					sortable: true,
					value: 'user.firstName',
				},
				{
					text: 'Last Name',
					sortable: true,
					value: 'user.lastName',
				},
				{
					text: 'Email',
					sortable: true,
					value: 'user.email',
				},
				{
					text: 'Store',
					sortable: true,
					value: 'user.store',
				},
				{
					text: 'District',
					sortable: true,
					value: 'user.district',
				},
				{
					text: 'Logged In',
					sortable: true,
					value: 'createdAt',
				},
			],
			logs: [],
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
			this.dates[0] = moment()
				.startOf('month')
				.format('YYYY-MM-DD')
			this.dates[1] = moment().format('YYYY-MM-DD')
			await this.axiosGetLogs()
			this.loading = false
		} catch (err) {
			console.error(err)
		}
	},

	computed: {
		logsFiltered() {
			console.log(this.logs);
			let arr = this.logs.filter((i) =>
				this.filteredStores.includes(i.user.store)
			)
			return arr
		},
		dateRangeText() {
			return this.dates.join(' to ')
		},
	},

	methods: {
		async axiosGetLogs() {
			try {
				const response = await axios({
					method: 'get',
					url: `${process.env.VUE_APP_API_URL}/api/v1/logs`,
					withCredentials: true,
					params: {
						'createdAt[gte]': this.dates[0],
						'createdAt[lte]': this.dates[1],
						'category[in]': ['login'],
						limit: 10000,
					},
				})

				this.logs = response.data.data
				console.log(this.logs)
			} catch (err) {
				this.openSnackbar(err.response.data.error)
				console.error(err)
			}
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
