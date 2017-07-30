# oni-build

oni-build allows you to quickly setup common build tasks without having to deal with the implementation details. The following tasks are currently supported with oni-build:

* Linting SCSS files (using standard stylelint and BEM rules)
* Compiling, autoprefixing, and minifying SCSS
* Linting JavaScript files (using standardjs rules)
* Bundling and uglifying JavaScript files
* Running BrowserSync for development or for debugging a live site
* Copying files and directories into another directory
* Deleting files and directories
* Running nodemon
* Watching files and running tasks when files change
* Running task sequences

## Getting Started

### Prerequisites
Ensure that you are running **Node 4+** and that you have **gulp** installed.

### Installation

Install the ```oni-build``` package through npm:

```npm install oni-build --save-dev```

### Basic Usage
Create a ```gulpfile.js``` file and pass a task config object to the package.

```js
/* gulpfile.js */

var build = require('oni-build')

var tasks = {
  taskname: {
    // task configuration
  }
}

build(tasks)
```
You can now run the tasks defined in the task object in the terminal with gulp:

```
gulp taskname
```

## Example

Assume we have the following project structure:

```
|-- project
    |-- src
    |   |-- images
    |   |   |-- logo.jpg
    |   |   |-- hero.jpg
    |   |   |-- icon.svg
    |   |
    |   |-- js
    |   |   |-- features
    |   |   |   |-- site-nav.js
    |   |   |   |-- search.js
    |   |   |   |-- dropdown.js
    |   |   |    
    |   |   |-- site.js
    |   |
    |   |-- styles
    |   |   |-- blocks
    |   |   |   |-- _site-nav.scss
    |   |   |   |-- _search.scss
    |   |   |   |-- _dropdown.scss
    |   |   |    
    |   |   |-- site.scss
    |   |
    |-- package.json
    |-- gulpfile.js
```

Assume we have the following gulpfile:

```js
/* gulpfile.js */

var build = require('oni-build')

var tasks = {
  'lint-scss': {
    type: 'oni-lint-styles',
    src: ['src/styles/**/*.scss']
  },
  'compile-scss': {
    type: 'oni-compile-styles',
    src: ['src/styles/**/*.scss'],
    dest: ['public/styles']
  },
  'build-scss': {
    type: 'oni-sequence',
    sequence: [
      'lint-scss',
      'compile-scss'
    ]
  },
  'bundle-js': {
    type: 'oni-bundle-js',
    src: ['src/js/site.js'],
    dest: ['public/js']
  },
  copy: {
    type: 'oni-copy',
    sources: [
      {
        src: 'src/images/**/*',
        dest: 'public/images'
      }
    ]
  },
  watch: {
    type: 'oni-watch',
    sources: [
      {
        src: 'src/styles/**/*.scss',
        sequence: [ 'build-scss' ]
      },
      {
        src: 'src/js/**/*.js',
        sequence: [ 'bundle-js' ]
      }
    ]
  },
  clean: {
    type: 'oni-delete',
    src: 'public'
  },
  dev: {
    type: 'oni-sequence',
    sequence: [
      'clean',
      ['build-scss', 'bundle-js', 'copy'],
      'watch'
    ]
  }
}

build(tasks)
```

Running `gulp build-scss` will:
1. Lint all of the SCSS files
2. Compile, autoprefix, and minify the scss
3. Output a `site.css` file in the `public/styles` folder (if the `public/styles` folder doesn't exist, the folder will be created)

Running `gulp watch` will:
1. Watch all of the SCSS files in the `src/styles` directory. When one of those files changes, the `build-scss` task will be run
2. Watch all of the JavaScript files in the `src/js` directory. When one of those files changes, the `bundle-js` task will be run

Running `gulp dev` will:
1. Delete the `public` folder
2. Then run the `build-scss`, `bundle-js`,  and `copy` tasks in parallel
3. When all 3 tasks in step 2 are complete, the `watch` task will run and watch files
