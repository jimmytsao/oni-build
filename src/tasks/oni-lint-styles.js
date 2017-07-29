var gulp = require('gulp');
var _ = require('lodash');
var postcss = require('gulp-postcss');
var bemLinter = require('postcss-bem-linter');
var reporter = require('postcss-reporter');
var stylelint = require('stylelint');
var scssSyntax = require('postcss-scss');

var stylelintConfig = require('stylelint-config-standard');

var defaultOptions = {
  bemLinter: true,
  stylelintConfig,
  bemLinterConfig: {
    preset: 'bem'
  }
};

var createTask = function(taskName, taskConfig){
  var options = _.merge({}, defaultOptions, taskConfig);

  gulp.task(taskName, function(){

  var processors = [ stylelint(options.stylelintConfig) ];

  if (options.bemLinter) {
    if (!options.bemLinterConfig.implicitComponents) {
      options.bemLinterConfig.implicitComponents = options.bemLinterSrc || options.src;
    }
    processors.push(bemLinter(options.bemLinterConfig));
  }

  processors.push(
    reporter({
      clearReportedMessages: true,
    })
  );

  return gulp.src(options.src)
    .pipe(postcss(processors, {syntax: scssSyntax}));
  });
};

module.exports = function(taskName, taskConfig){
  createTask(taskName, taskConfig);
};
