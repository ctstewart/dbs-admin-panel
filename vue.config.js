module.exports = {
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'Benefit Sheet | Admin Panel'
				return args
			})
	},
	publicPath: '',
	devServer: {
		port: process.env.DEV_SERVER_PORT,
	},
	transpileDependencies: ['vuetify'],
}
