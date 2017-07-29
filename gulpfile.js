var tasks = {
  scss: {
    type: '1n-scss',
    src: 'mockFiles/styles/*.scss',
    dest: ['public/styles', 'public/styles/subfolder']
  },
  bundlejs: {
    type: '1n-bundlejs',
    src: ['mockFiles/js/site.js', 'mockFiles/js/modules/homepage.js'],
    dest: ['public/js', 'public/js/subfolder']
  },
  lintcss: {
    type: '1n-lint-css',
    src: ['mockFiles/styles/**/*.scss'],
    bemLinterSrc: ['mockFiles/styles/components/**/*.scss'],
  },
  styles: {
    type: '1n-sequence',
    sequence: [
      'lintcss',
      'scss'
    ]
  },
  copy: {
    type: '1n-copy',
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
  },
  dev: {
    type: '1n-sequence',
    sequence: [
      'copy',
      ['scss', 'bundlejs']
    ]
  },
  another: {
    type: '1n-sequence',
    sequence: [
      'copy',
      'bundlejs'
    ]
  },
  combo: {
    type: '1n-sequence',
    sequence: [
      'del',
      'dev',
      'another'
    ]
  },
  watch: {
    type: '1n-watch',
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
  },
  del: {
    type: '1n-delete',
    src: 'public'
  },
  browsersync: {
    type: '1n-browser-sync',
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
  },
  nodemon: {
    type: '1n-nodemon',
    script: '../../projects/latham-watkins-keystone/keystone.js',
    envFile: '../../projects/latham-watkins-keystone/.env'
  },
  scssTest: {
    type: '1n-scss',
    src: '../../projects/latham-watkins-keystone/src/client/styles/site.scss',
    dest: ['build/styles']
  },
  testBrowserSync: {
    type: '1n-sequence',
    sequence: [
      'del',
      'scssTest',
      'browsersync'
    ]
  },
  test: {
    type: '1n-sequence',
    sequence: [
      'custom',
      'nodemon',
      'browsersync'
    ]
  },
  custom: {
    type: 'custom',
    customTask: function(callback){
      console.log('Ran a custom task');
      callback();
    }
  }
}

require('./src/index')(tasks);
