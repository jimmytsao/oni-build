var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var gulpIf = require('gulp-if');
var rename = require('gulp-rename');
var _ = require('lodash');


var defaultOptions = {
  sourcemaps: true,
  autoprefixer: true,
  minify: true,
  sourcemapsDest: '',
  rename: ''
};

var createTask = function(taskName, taskConfig){
  var options = _.merge(defaultOptions, taskConfig.options);
  var autoprefixerOptions = options.autoprefixerOptions || { browsers: ['last 2 version'] };
  var destinations = [].concat(options.dest);

  gulp.task(taskName, function(){
    var task = gulp.src(options.src)
      .pipe(gulpIf(options.sourcemaps, sourcemaps.init()))
      .pipe(sass().on('error', sass.logError))
      .pipe(gulpIf(options.autoprefixer, autoprefixer(autoprefixerOptions)))
      .pipe(gulpIf(options.minify, cssnano()))
      .pipe(gulpIf(!!options.rename, rename(options.rename)))
      .pipe(gulpIf(options.sourcemaps, sourcemaps.write(options.sourcemapsDest || '.')));

    destinations.forEach(function(location){
      task.pipe(gulp.dest(location));
    });

    return task;
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
