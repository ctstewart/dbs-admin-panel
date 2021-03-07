<template>
	<div>
		<app-bar />
		<v-card>
			<v-data-table
				:headers="headers"
				:items="logs"
				:options.sync="options"
				:server-items-length="totalLogsCount"
				class="elevation-1"
				:loading="loading"
				loading-text="Loading... Please wait"
			>

				<template v-slot:[`item.createdAt`]="{ item }">
					{{ new Date(item.createdAt).toLocaleString('en-US') }}
				</template>

				<template v-slot:top>
					<v-row><v-col></v-col></v-row>
					<v-toolbar flat>
						<v-row m-4>
							<v-col cols="2">
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
							<v-col cols="5">
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
								></v-autocomplete>
							</v-col>
							<v-col cols="5">
								<v-autocomplete
									chips
									clearable
									deletable-chips
									small-chips
									outlined
									solo
									label="Districts"
									:items="districts"
									v-model="filteredDistricts"
									multiple
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
			options: {},
			totalLogsCount: 0,
			dialogFilters: false,
			loading: true,
			menu: false,
			filteredStores: [],
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
		dateRangeText() {
			return this.dates.join(' to ')
		},
	},

	watch: {
		options: {
			async handler () {
				this.loading = true
				await this.axiosGetLogs()
				this.loading = false
			},
			deep: true,
		},
		filteredStores: {
			async handler () {
				this.loading = true
				await this.axiosGetLogs()
				this.loading = false
			},
			deep: true,
		},
		filteredDistricts: {
			async handler () {
				this.loading = true
				await this.axiosGetLogs()
				this.loading = false
			},
			deep: true,
		}
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
						'store[in]': this.filteredStores,
						'district[in]': this.filteredDistricts,
						sort: this.options.sortBy,
						limit: this.options.itemsPerPage,
						page: this.options.page,
					},
				})

				this.totalLogsCount = response.data.pagination.total

				this.logs = response.data.data
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
