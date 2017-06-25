

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
		},
		copy: {
			type: '1n-copy',
			options: {
				sources: [
					{
						src: 'mockSrc/images/**/*',
						dest: 'public/images'
					},
					{
						src: 'mockSrc/images/**/*',
						dest: 'public/images/subfolder'
					}
				]
			}
		}
	}
}

require('./tasks/index')(config);
