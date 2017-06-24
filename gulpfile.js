

var config = {
  tasks: {
    scss: {
      type: '1n-scss',
      options: {
        src: 'mockSrc/styles/*.scss',
        dest: ['public/styles', 'public/styles/subfolder']
      }
    },
  }
}

require('./tasks/index')(config);
