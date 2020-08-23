module.exports = {
	publicPath: '',
	devServer: {
		host: '0.0.0.0',
		https: true,
		port: process.env.DEV_SERVER_PORT,
		public: process.env.DEV_SERVER_PUBLIC,
	},
	transpileDependencies: ['vuetify'],
}
