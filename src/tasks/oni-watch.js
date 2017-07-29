var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

var createTask = function(taskName, taskConfig){

  gulp.task(taskName, function(callback){
    var sources = taskConfig.sources;

    sources.forEach(function(source){
      gulp.watch(source.src, function(){
        runSequence.apply(null, source.sequence);
      })
    });

    callback();
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
}
