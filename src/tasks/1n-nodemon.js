var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var _ = require('lodash');
var dotenv = require('dotenv');

var createTask = function(taskName, taskConfig){

  gulp.task(taskName, function(){

    var options = _.cloneDeep(taskConfig.options);

    if (options.envFile){
      options.env = dotenv.load({path: options.envFile}).parsed;
    }

    var stream = nodemon(options);

    _.each(options.eventHandlers, function(config){
      stream.on(config.event, function(){
        config.handler(stream);
      });
    });
  });
};

module.exports = function(taskName, options){
  createTask(taskName, options);
}
