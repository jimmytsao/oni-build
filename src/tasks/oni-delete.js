var gulp = require('gulp');
var del = require('del');

var createTask = function(taskName, taskConfig){
  gulp.task(taskName, function(){
    return del([].concat(taskConfig.src));
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
}
