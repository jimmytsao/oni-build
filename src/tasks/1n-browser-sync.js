var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var createTask = function(taskName, taskConfig){
  gulp.task(taskName, function(callback){
    browserSync.init(taskConfig.options);

    // TODO: Add middleware to serve files
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
