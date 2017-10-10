const webpack = require('webpack');
const path = require('path');

module.exports = {
	devtool: "source-map",
	context: path.resolve(__dirname, "src"),
	entry: {
		build: "./index.js"
	},
	output: {
		path: path.resolve(__dirname, "assets/js"),
		filename: "[name].js"
	},
	module: {
		rules: [
			{
				test: /\.js$/, 
				include: [
					path.resolve(__dirname, "./src")
				],
				exclude: /node_modules/,
				loader: "babel-loader",
				options: {
					presets: ["es2015"]
				},
			}
		]
	},
	resolve: {
		modules: [
			"node_modules",
			path.resolve('src', 'js')
		]
	},
	watch: true
};