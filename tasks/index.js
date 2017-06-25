var scss = require('./1n-scss');
var bundlejs = require('./1n-bundlejs');
var copy = require('./1n-copy');

var _ = require('lodash');

var taskSetupMap = {
  '1n-scss': scss,
  '1n-bundlejs': bundlejs,
  '1n-copy': copy
};

module.exports = function(config){

  var tasks = config.tasks;

  _.each(tasks, function(task, taskName){
    var taskSetup = taskSetupMap[task.type];
    if (taskSetup)
      taskSetup(taskName, task);
  });
}
