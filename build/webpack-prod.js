"use strict";

const webpack = require("webpack");
const merge = require("webpack-merge");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const config = require("./webpack");
const buildUtils = require("./buildUtils");

const webpackConfig = merge(config, {
	devtool: false,
	output: {
		filename: "[name].[chunkhash:8].js",
		chunkFilename: "[name].[chunkhash:8].js"
	},
	module: {
		rules: buildUtils.styleLoaders({sourceMap: false, extract: true})
	},
	plugins: [
		new UglifyJSPlugin({
			sourceMap: false,
			compress: {
				warnings: false,
				drop_debugger: true,
				drop_console: false,
				global_defs: {
					DEBUG: false
				}
			},
			output: {
				comments: false
			}
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		//  name: "manifest",
		//  chunks: ["utils", "main"]
		// }),
		new ExtractTextPlugin("styles.[chunkhash:8].css"),
	],
});
// console.log('plugins', webpackConfig.plugins);
module.exports = webpackConfig;
