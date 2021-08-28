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
		port: 4000,
	},
	transpileDependencies: ['vuetify'],
}
