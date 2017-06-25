var gulp = require('gulp');
var runSequence = require('run-sequence').use(gulp);

var createTask = function(taskName, taskConfig){

  gulp.task(taskName, function(callback){
    var sources = taskConfig.options.sources;

    sources.forEach(function(source){
      gulp.watch(source.src, function(){
        runSequence.apply(null, source.sequence);
      })
    });
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
