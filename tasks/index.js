var scss = require('./1n-scss');
var _ = require('lodash');

var taskSetupMap = {
  '1n-scss': scss
};

module.exports = function(config){

  var tasks = config.tasks;

  _.each(tasks, function(task, taskName){
    var taskSetup = taskSetupMap[task.type];
    if (taskSetup)
      taskSetup(taskName, task);
  });
}
