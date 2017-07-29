var gulp = require('gulp');
var rename = require('gulp-rename');
var gulpIf = require('gulp-if');
var pipeDests = require('./../helpers/pipeDests');

var createTask = function(taskName, taskConfig){
  var sources = taskConfig.sources;

  gulp.task(taskName, function(callback){

    var tasks = sources.map(function(config){
      return new Promise(function(resolve){
        var task = gulp.src(config.src)
          .pipe(gulpIf(!!config.rename, rename(config.rename)));

        pipeDests(task, config.dest);

        task.on('end', resolve);
      })
    });

    Promise.all(tasks)
      .then(function(){
        callback();
      })
      .catch(function(error){
        if (err){
          console.log('Error in task ' + taskName, err);
        }
      });
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
}
