var gulp = require('gulp');
var del = require('del');

var createTask = function(taskName, taskConfig){
  gulp.task(taskName, function(){
    return del([].concat(taskConfig.options.src));
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
