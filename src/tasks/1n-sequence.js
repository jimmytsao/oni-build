var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);
var _ = require('lodash');

var createTask = function(taskName, taskConfig){
  gulp.task(taskName, function(callback){

    // Avoid mutatation of the sequence array
    var sequence = _.cloneDeep(taskConfig.options.sequence);

    sequence.push(callback);

    return runSequence.apply(null, sequence);
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
