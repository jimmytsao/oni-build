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
		lintcss: {
			type: '1n-lint-css',
			options: {
        src: ['mockFiles/styles/**/*.scss'],
        bemLinterSrc: ['mockFiles/styles/components/**/*.scss'],
			}
    },
    styles: {
      type: '1n-sequence',
      options: {
        sequence: [
          'lintcss',
          'scss'
        ]
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
        files: 'build/**/*',
        serveStatic: [
          {
            route: '/test',
            dir: './build/styles'
          }
        ],
        port: 3030,
        proxy: 'https://www.lathamdrive.com',
        rewriteRules: [
          {
            match: new RegExp('styles/site-e956493884.css'),
            replace: 'test/site.css'
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
        dest: ['build/styles']
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
