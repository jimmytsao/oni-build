var gulp = require('gulp');
var browserSync = require('browser-sync').create();

var createTask = function(taskName, taskConfig){
  gulp.task(taskName, function(callback){

    browserSync.init(taskConfig);
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
}
