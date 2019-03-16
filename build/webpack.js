'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const buildUtils = require('./buildUtils');

const definePlugin = new webpack.DefinePlugin(buildUtils.env());

const reactMainFest = require(
	path.resolve(__dirname, '../front-vendor/react-manifest.json'));
const reduxMainFest = require(
	path.resolve(__dirname, '../front-vendor/redux-manifest.json'));
const uiMainFest = require(path.resolve(__dirname, '../front-vendor/ui-manifest.json'));
const libMainFest = require(
	path.resolve(__dirname, '../front-vendor/lib-manifest.json'));

let nodeEnv = process.env.NODE_ENV;
if (!nodeEnv) {
	nodeEnv = 'development';
}
const isDev = nodeEnv === 'development';

process.traceDeprecation = true;
module.exports = {
	cache: true,
	devtool: 'eval-source-map',
	entry: {
		'main': path.resolve(__dirname, '../src/index'),
		'utils': path.resolve(__dirname, '../src/utils/index'),
	},
	output: {
		path: path.resolve(__dirname, '../dist'),
		filename: '[name].bundle.js',
		publicPath: '/dist/',
	},
	plugins: [
		new webpack.DllReferencePlugin({
			context: path.resolve(__dirname, '..'),
			manifest: reactMainFest,
		}),
		new webpack.DllReferencePlugin({
			context: path.resolve(__dirname, '..'),
			manifest: reduxMainFest,
		}),
		new webpack.DllReferencePlugin({
			context: path.resolve(__dirname, '..'),
			manifest: uiMainFest,
		}),
		new webpack.DllReferencePlugin({
			context: path.resolve(__dirname, '..'),
			manifest: libMainFest,
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, '../index.html'),
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				// more options:
				// https://github.com/kangax/html-minifier#options-quick-reference
			},
			// necessary to consistently work with multiple chunks via CommonsChunkPlugin
			chunksSortMode: 'dependency',
		}),
		new webpack.optimize.CommonsChunkPlugin(
			{ name: 'utils', filename: 'utils.js' }
		),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: {
					configFile: './.eslintrc',
				},
			},
		}),
		definePlugin,
	],
	resolve: {
		modules: [
			'node_modules',
			path.join(__dirname, 'src'),
		],
		extensions: ['.js', '.jsx', '.json'],
		alias: buildUtils.alias(),
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				include: [
					path.resolve(__dirname, '../src'),
					path.resolve(__dirname, '../test'),
				],
			},
			{
				test: /\.js$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: [
					path.resolve(__dirname, '../src'),
				],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/,
				loader: 'url-loader',
				options: { limit: 10240 },
			},

		],
	},
};