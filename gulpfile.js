var config = {
	tasks: {
		scss: {
			type: '1n-scss',
			options: {
				src: 'mockFiles/styles/*.scss',
				dest: ['public/styles', 'public/styles/subfolder']
			}
		},
		bundlejs: {
			type: '1n-bundlejs',
			options: {
				src: ['mockFiles/js/site.js', 'mockFiles/js/modules/homepage.js'],
				dest: ['public/js', 'public/js/subfolder']
			}
		},
		copy: {
			type: '1n-copy',
			options: {
				sources: [
					{
						src: 'mockFiles/images/**/*',
						dest: 'public/images'
					},
					{
						src: 'mockFiles/images/**/*',
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
            src: 'mockFiles/js/**.*',
            sequence: [
              'combo'
            ]
          },
          {
            src: 'mockFiles/styles/**/*',
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
        serveStatic: [
          {
            route: '/public',
            dir: '/public'
          }
        ],
        port: 3030,
        proxy: 'https://www.lathamdrive.com',
        rewriteRules: [
          {
            match: new RegExp('site-e956493884.css'),
            replace: 'site.css'
          }
        ]
      }
    },
    nodemon: {
      type: '1n-nodemon',
      options: {
        script: '../../projects/latham-watkins-keystone/keystone.js',
        envFile: '../../projects/latham-watkins-keystone/.env'
      }
    },
    scssTest: {
      type: '1n-scss',
      options: {
        src: '../../projects/latham-watkins-keystone/src/client/styles/site.scss',
        dest: ['public/styles']
      }
    },
    testBrowserSync: {
      type: '1n-sequence',
      options: {
        sequence: [
          'del',
          'scssTest',
          'browsersync'
        ]
      }
    },
    test: {
      type: '1n-sequence',
      options: {
        sequence: [
          'custom',
          'nodemon',
          'browsersync'
        ]
      }
    },
    custom: {
      type: 'custom',
      options: {
        customTask: function(callback){
          console.log('Ran a custom task');
          callback();
        }
      }
    }
	}
}

require('./src/index')(config);
