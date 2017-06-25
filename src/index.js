var _ = require('lodash');
var requireDir = require('require-dir');

var taskSetupMap = requireDir('./tasks');

module.exports = function(config){

  var tasks = config.tasks;

  _.each(tasks, function(task, taskName){
    var taskSetup = taskSetupMap[task.type];
    if (taskSetup) {
      taskSetup(taskName, task);
    } else {
      throw new Error('Incorrect task type in gulpfile config for task: ' + taskName);
    }
  });
}
