var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var _ = require('lodash');
var dotenv = require('dotenv');

var createTask = function(taskName, taskConfig){

  gulp.task(taskName, function(callback){

    var options = _.cloneDeep(taskConfig);

    if (options.envFile){
      options.env = dotenv.load({path: options.envFile}).parsed;
    }

    var stream = nodemon(options);

    _.each(options.eventHandlers, function(config){
      stream.on(config.event, function(){
        config.handler(stream);
      });
    });

    stream.on('start', callback);
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
}
