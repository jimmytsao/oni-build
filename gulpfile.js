var tasks = {
  scss: {
    type: 'oni-compile-styles',
    src: 'mockFiles/styles/*.scss',
    dest: ['public/styles', 'public/styles/subfolder']
  },
  bundlejs: {
    type: 'oni-bundle-js',
    src: ['mockFiles/js/site.js', 'mockFiles/js/modules/homepage.js'],
    dest: ['public/js', 'public/js/subfolder']
  },
  lintcss: {
    type: 'oni-lint-styles',
    src: ['mockFiles/styles/**/*.scss'],
    bemLinterSrc: ['mockFiles/styles/components/**/*.scss'],
  },
  styles: {
    type: 'oni-sequence',
    sequence: [
      'lintcss',
      'scss'
    ]
  },
  copy: {
    type: 'oni-copy',
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
    type: 'oni-sequence',
    sequence: [
      'copy',
      ['scss', 'bundlejs']
    ]
  },
  another: {
    type: 'oni-sequence',
    sequence: [
      'copy',
      'bundlejs'
    ]
  },
  combo: {
    type: 'oni-sequence',
    sequence: [
      'del',
      'dev',
      'another'
    ]
  },
  watch: {
    type: 'oni-watch',
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
    type: 'oni-delete',
    src: 'public'
  },
  browsersync: {
    type: 'oni-browser-sync',
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
    type: 'oni-nodemon',
    script: '../../projects/latham-watkins-keystone/keystone.js',
    envFile: '../../projects/latham-watkins-keystone/.env'
  },
  scssTest: {
    type: 'oni-compile-styles',
    src: '../../projects/latham-watkins-keystone/src/client/styles/site.scss',
    dest: ['build/styles']
  },
  testBrowserSync: {
    type: 'oni-sequence',
    sequence: [
      'del',
      'scssTest',
      'browsersync'
    ]
  },
  test: {
    type: 'oni-sequence',
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
