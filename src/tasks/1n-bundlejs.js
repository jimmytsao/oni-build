var gulp = require('gulp');
var webpack = require('webpack');
var webpackStream = require('webpack-stream');
var path = require('path');
var _ = require('lodash');
var pipeDests = require('./../helpers/pipeDests');

var defaultOptions = {
	sourcemaps: true,
  uglify: true,
  resolve: {}
};

var getFilename = function(options){

	var defaultFile = _.isArray(options.src) ? options.src[0] : options.src;
	var defaultFileName = path.basename(defaultFile, path.extname(defaultFile)) + '.js';

	return options.rename ? options.rename : defaultFileName;
};

var addUglifyJsPlugin = function(){
	return new webpack.optimize.UglifyJsPlugin({
		compress: {warnings: false }
	});
}

var addEnvVariables = function(options){
	var envObj = _.mapKeys(options.env, function(value, key){
		return 'process.env.' + key;
	});

	return new webpack.DefinePlugin(envObj);
}

var createTask = function(taskName, taskConfig){
	var options = _.merge({}, defaultOptions, taskConfig.options);

	var webpackConfig = {
		devtool: options.sourcemaps ? 'source-map' : '',
		output: {
			filename: getFilename(options)
		},
		module:{
			rules: [
				{
					test: /\.js$/,
					exclude: /(node_modules|bower_components)/,
					use: {
						loader: 'babel-loader',
						options: {
							presets: ['es2015', 'stage-2']
						}
					}
				}
			]
    },
    resolve: options.resolve,
		plugins: _.without([
			options.uglify ? addUglifyJsPlugin(options) : undefined,
			options.env ? addEnvVariables(options) : undefined
		].concat(options.plugins), undefined)
	};

	gulp.task(taskName, function(){
		var task = gulp.src(options.src)
			.pipe(webpackStream(webpackConfig, webpack));

		pipeDests(task, options.dest);

		return task;
	});
};

module.exports = function(taskName, options){
	createTask(taskName, options);
}
