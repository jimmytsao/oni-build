var gulp = require('gulp');
var _ = require('lodash');

var createTask = function(taskName, taskConfig){

  gulp.task(taskName, function(callback){
    var options = _.cloneDeep(taskConfig.options);

    taskConfig.options.customTask(callback, gulp, options);
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
