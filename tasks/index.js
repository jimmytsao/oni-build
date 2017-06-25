var scss = require('./1n-scss');
var bundlejs = require('./1n-bundlejs');
var copy = require('./1n-copy');
var sequence = require('./1n-sequence');
var watch = require('./1n-watch');
var del = require('./1n-delete')

var _ = require('lodash');

var taskSetupMap = {
  '1n-scss': scss,
  '1n-bundlejs': bundlejs,
  '1n-copy': copy,
  '1n-sequence': sequence,
  '1n-watch': watch,
  '1n-delete': del
};

module.exports = function(config){

  var tasks = config.tasks;

  _.each(tasks, function(task, taskName){
    var taskSetup = taskSetupMap[task.type];
    if (taskSetup)
      taskSetup(taskName, task);
  });
}
