var gulp = require('gulp');
var runSequence = require('run-sequence')

var createTask = function(taskName, taskConfig){
  var sequence = taskConfig.options.sequence;

  gulp.task(taskName, function(callback){
    sequence.push(callback);

    return runSequence.apply(null, sequence);
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
