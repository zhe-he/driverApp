const webpack = require("webpack");
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');

const autoprefixer = require('autoprefixer');
// const pluginsText = new Date().toUTCString() + '\n\r * built by `zhe-he`';


const DIST = 'assets';
var commonJs = ['whatwg-fetch','babel-polyfill',"js/lib/fastclick.js","js/lib/autosize.js"];
var files = fs.readdirSync('js/page');
var entryFiles = {};
for (var i = 0; i < files.length; i++) {
	var name = files[i].substring(0,files[i].lastIndexOf('.'));
	if (name===''){continue}
	entryFiles[name] = commonJs.concat(`js/page/${files[i]}`);
}
Object.assign(entryFiles,{
	// 自定义
	// name: '入口js'
});

function htmlplugin(htmlname,entryname){
	return new HtmlWebpackPlugin({
		filename: htmlname,
		template: `html/${htmlname}`,
		favicon: 'images/favicon.ico',
		minify: {
			minimize: true,
			removeComments: true,
			collapseWhitespace: true
		},
		inject: "head",
		hash: true,
		chunks: ["common",entryname]
	});
}
var htmls = fs.readdirSync('html');
var entryHtmls = [];
for (var i = 0; i < htmls.length; i++) {
	var name = htmls[i].substring(0,htmls[i].lastIndexOf('.'));
	if (name===''){continue}
	entryHtmls.push( htmlplugin(htmls[i],name) );
}

var loaders = [
	{loader: 'css-loader'},
	{
		loader: 'postcss-loader',
		options: {
			// ident: 'postcss',
			config: 'config/postcss.config.js'
		}
	}
];
module.exports = {
	// 页面入口文件配置
	entry: entryFiles,
	// 入口文件输出配置
	output: {
		publicPath: '../',
		path: path.resolve(__dirname, DIST),
		filename: 'js/[name].js'
	},
	// 插件项
	plugins: [
		new webpack.optimize.CommonsChunkPlugin({
			name: "common",
			minChunks: 3
		}),
	    new ExtractTextPlugin('css/[name].css'),
	    new CopyWebpackPlugin([
			{from: 'images/tmp/**/*'}
		])
	].concat(entryHtmls),
	module: {
		rules: [
			{
				test: /\.html$/,
				exclude:/node_modules/,
				use: [
					{
						loader: 'html-loader'
					}
				]
			},
			{
				test: /\.js$/,
				exclude:/(node_modules|lib)/,
				use: [
					{
						loader:'babel-loader',
						options: {presets: [["es2015", { "modules": false }]]}
					}
				]
			},
			{test: /\.tsx?$/,exclude:/(node_modules)/,use:['ts-loader']},
			{
				test: /\.css$/,
				exclude:/node_modules|libs/,
				use: ExtractTextPlugin.extract({
		        	fallback: 'style-loader',
		         	use: loaders
		        })
			},
			{
				test: /\.(scss|sass)$/,
				exclude:/node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: loaders.concat({loader: 'sass-loader'})
				})
			},
			{
				test: /\.less$/,
				exclude:/node_modules/,
				use: ExtractTextPlugin.extract({
					fallback: 'style-loader',
					use: loaders.concat({loader: 'less-loader'})
				})
			},
			{
				test: /\.vue$/,
				exclude:/node_modules/,
				use: [
					{
						loader: 'vue-loader',
						options: {
							preserveWhitespace: false,
							postcss: [autoprefixer({browsers: ['last 9 versions']})],
							loaders: {
								// 'ts': 'vue-ts-loader',
								'js': 'babel-loader?presets[]=es2015'
							}
						}
					}
				]
			},
			{test: /\.(json|data)$/,exclude:/node_modules/,use: ['json-loader']},
			{test: /\.(txt|md)$/,exclude:/node_modules/,use: ['raw-loader']},
			{test: /\.svg$/,use: ['raw-loader']},
			{
				test: /\.(png|jpe?g|gif)$/,
				exclude:/node_modules/,
				use: [
					{
						loader:'url-loader',
						options: {
							limit: 8192,
							name: '[path][name].[ext]?[hash]'
						}
					}
				]
			},
			{
				test: /\.(ttf|woff2?|svg|eot)$/,
				exclude:/node_modules/,
				use: [
					{
						loader:'url-loader',
						options: {
							limit: 1,
							name: 'fonts/[name].[ext]?[hash]'
						}
					}
				]
			},
		]
	},
	// 其他配置
	resolve: {
		modules: [
			process.cwd(),
			"node_modules"
		],
		extensions: ['.ts','.js','.vue'],
		alias: {
			"vue": 				"js/lib/vue.common.js",
		}
	}
};