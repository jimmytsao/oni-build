

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
		},
    dev: {
      type: '1n-sequence',
      options: {
        sequence: [
          'copy',
          ['scss', 'bundlejs']
        ]
      }
    },
    another: {
      type: '1n-sequence',
      options: {
        sequence: [
          'copy',
          'bundlejs'
        ]
      }
    },
    combo: {
      type: '1n-sequence',
      options: {
        sequence: [
          'del',
          'dev',
          'another'
        ]
      }
    },
    watch: {
      type: '1n-watch',
      options: {
        sources: [
          {
            src: 'mockSrc/js/**.*',
            sequence: [
              'combo'
            ]
          },
          {
            src: 'mockSrc/styles/**/*',
            sequence: [
              'scss',
              'copy'
            ]
          }
        ]
      }
    },
    del: {
      type: '1n-delete',
      options: {
        src: 'public'
      }
    },
    browsersync: {
      type: '1n-browser-sync',
      options: {
        files: 'public/**/*',
        port: 3030,
        proxy: 'localhost:3000',
      }
    },
    nodemon: {
      type: '1n-nodemon',
      options: {
        script: '../../projects/latham-watkins-keystone/keystone.js',
        envFile: '../../projects/latham-watkins-keystone/.env'
      }
    },
    test: {
      type: '1n-sequence',
      options: {
        sequence: [
          'nodemon',
          'browsersync'
        ]
      }
    }
	}
}

require('./tasks/index')(config);
