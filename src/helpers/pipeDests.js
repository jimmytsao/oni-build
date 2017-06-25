var gulp = require('gulp');

// Helper to pipe stream to multiple destinations
module.exports = function(task, dest){
	var destinations = [].concat(dest);

	destinations.forEach(function(location){
		task.pipe(gulp.dest(location));
	});
}
