

var config = {
	tasks: {
		scss: {
			type: '1n-scss',
			options: {
				src: 'mockSrc/styles/*.scss',
				dest: ['public/styles', 'public/styles/subfolder']
			}
		},
		bundlejs: {
			type: '1n-bundlejs',
			options: {
				src: ['mockSrc/js/site.js', 'mockSrc/js/modules/homepage.js'],
				dest: ['public/js', 'public/js/subfolder']
			}
		}
	}
}

require('./tasks/index')(config);
