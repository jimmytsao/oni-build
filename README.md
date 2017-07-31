# oni-build

oni-build allows you to quickly setup common build tasks without having to deal with the implementation details. The following tasks are currently supported with oni-build:

* Linting, compiling, autoprefixing, and minifying SCSS
* Linting, bundling, and uglifying JavaScript
* Running BrowserSync for development or for debugging a live site
* Copying files and directories into another directory
* Deleting files and directories
* Watching files and running tasks when files change
* Running custom task sequences
* Running nodemon

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


Resulting project structure after running `gulp dev`
```
|-- project
    |-- public
    |   |-- images
    |   |   |-- logo.jpg
    |   |   |-- hero.jpg
    |   |   |-- icon.svg
    |   |
    |   |-- js
    |   |   |-- site.js
    |   |
    |   |-- styles
    |   |   |-- site.css
    |   |
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

## Task Configuration

Predefined `oni-build` tasks are selected through the `type` property for each task configuration object. The task types that can be selected are:
* `oni-lint-styles`
* `oni-compile-styles`
* `oni-bundle-js`
* `oni-copy`
* `oni-delete`
* `oni-sequence`
* `oni-watch`
* `oni-browser-sync`
* `oni-nodemon`

### `oni-lint-styles`

`oni-lint-styles` lint sSCSS files with `stylelint-config-standard` and `postcss-bem-linter` rules.

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`src` | `String` or `Array<String>` | - |File path(s) to the SCSS files that need to be linted
`bemLinter` | `Boolean` | `true` | Check that class names confirm to BEM standards
`bemLinterSrc` | `String` or `Array<String>` | value provided by `src` | File path(s) to SCSS files that should be BEM Linted

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'lint-styles': {
    type: 'oni-lint-styles',
    src: ['src/styles/**/*.scss'],
    bemLinter: true,
    bemLinterSrc: ['src/styles/blocks/*.scss']
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp lint-styles
```



### `oni-compile-styles`

`oni-compile-styles` compiles SCSS files to CSS

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`src` | `String` or `Array<String>` | - |File path(s) of the entry point(s) to the SCSS project
`dest` | `String` or `Array<String>` | - | Destination folder(s) for the compiled CSS
`rename` | `String` | - | The default output file name is the name of the entry file. Use this option to change the output filename to a different name
`sourcemaps` | `Boolean` | `true` | Generate sourcemaps and output sourcemaps to the `dest` folder(s)
`autoprefixer` | `Boolean` | `true` | Add browser prefixes for cross-browser support
`minify` | `Boolean` | `true` | Output minified CSS


#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'compile-styles': {
    type: 'oni-compile-styles',
    src: 'src/styles/site.scss',
    dest: ['public/styles', 'another/dest/folder']
    uglify: true,
    lint: true,
    autoprefixer: true,
    rename: 'site.min.css'
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp compile-styles
```

### `oni-bundle-js`

`oni-bundle-js` bundles JavaScript utilizing `webpack`. JavaScript linting is also enabled by default utilizing the `standardjs` linting rules. All of the available options are listed below:

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`src` | `String` or `Array<String>` | - |File path(s) of the entry point(s) to the bundle
`dest` | `String` or `Array<String>` | - | Destination folder(s) for the compiled bundle
`uglify` | `Boolean` | `true` | Uglify compiled JavaScript
`lint` | `Boolean` | `true` | Lint JavaScript with `standardjs` rules

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'bundle-js': {
    type: 'oni-bundle-js',
    src: ['src/js/site.js'],
    dest: ['public/js', 'another/dest/folder'],
    uglify: true,
    lint: true
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp bundle-js
```

### `oni-copy`

`oni-copy` copies files to another folder.

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`sources` | `Array`<br>`<{ src: String` or  `Array<String>,` <br>`dest: String` or `Array<String> }>` | - | An array defining the files to copy and their destinations

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  copy: {
    type: 'oni-copy',
    sources: [
      {
        src: 'src/images/**/*',
        dest: ['public/images', 'another/dest/folder']
      },
      {
        src: ['src/fonts/**/*', 'another/fonts/folder/**'],
        dest: 'public/fonts'
      }
    ]
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp copy
```

### `oni-delete`

`oni-delete` deletes files or folders

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`src` | `String` or `Array<String>` | - |File path(s) and/or folders to delete

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  clean : {
    type: 'oni-delete',
    src: 'public'
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp clean
```


### `oni-sequence`

`oni-sequence` run a group of tasks in a specific order

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`sequence` | `Array<String` or `sequence>` | - | The list of tasks to run and the sequence in which they should run in. Tasks defined in an Array will run in parallel and will all need to be completed before moving onto the next task

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'lint-styles': {
    // task configuration
  },
  'compile-styles': {
    // task configuration    
  },
  'bundle-js': {
    // task configuration    
  },
  copy : {
    // task configuration    
  },
  clean : {
    // task configuration    
  },

  /*
    'delete' will run first
    'lint-styles' will run after 'delete' is complete
    'compile-styles' and 'bundle-js' will both run after 'lint-styles' is complete
    'copy' will run after both 'compile-styles' and 'bundle-js' are complete
  */
  sequence: {
    type: 'oni-sequence',
    sequence: [
      'clean',
      'lint-styles',
      ['compile-styles', 'bundle-js'],
      'copy'
    ]
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp sequence
```

### `oni-watch`

`oni-watch` watch files and run a sequence of tasks when a file changes

#### Options

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`sources` | `Array`<br>`<{ src: String` or `Array<String>,` <br>`sequence: Array <String` or `Array<String>> }>` | - | An array defining the files to watch and a sequence of tasks to run when those files change. The sequence is defined the same way as `sequence` in the `oni-sequence` task

#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'lint-styles': {
    // task configuration
  },
  'compile-styles': {
    // task configuration    
  },
  'bundle-js': {
    // task configuration    
  },
  watch: {
    type: 'oni-watch',
    sources: [
      {
        src: 'src/styles/**/*.scss',
        sequence: [
          'lint-styles',
          'compile-styles'
        ]
      },
      {
        src: 'src/js/**/*.js',
        sequence: [ 'bundle-js' ]
      }
    ]
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp watch
```

### `oni-nodemon`

`oni-nodemon` allows you to use nodemon for development

#### Options

The task config object for `oni-nodemon` is passed directly to `gulp-nodemon`. As a result, all of the `gulp-nodemon` options can be used in the task config object. [See their documentation](https://github.com/JacksonGariety/gulp-nodemon) for details on available options.

The options in the table below can also be used in addition to the ones defined in `gulp-nodemon`:

| Option | Type | Default Value | Description
|:---:|:---:|:---:|---
`envFile` | `String` | - | File path to an .env file. The contents of the file will be loaded as environmental variables with `gulp-nodemon`
`eventHandlers` | `Array <{ event: String, handler: Function(stream) }>` | - | Array defining nodemon event callbacks. Each callback will be passed the `gulp-nodemon` stream as the first argument. [See the `gulp-nodemon` documentation](https://github.com/JacksonGariety/gulp-nodemon#events) for details.


#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'bundle-js': {
    // task configuration
  },
  'copy': {
    // task configuration
  },
  nodemon: {
    type: 'oni-nodemon',

    // gulp-nodemon options
    script: 'server.js',
    ignore: ['node_modules/**/*'],
    watch: ['src/server/**/*.js'],
    tasks: ['bundlejs', 'copy'],

    // oni-nodemon options
    envFile: '/.env',
    eventHandlers: [
      {
        event: 'crash',
        handler: function(stream){
          console.error('Application has crashed!\n')
          stream.emit('restart', 10)  // restart the server in 10 seconds
        }
      },
      {
        event: 'restart',
        handler: function(stream){
          console.log('Server Restarted!);
        }
      }
    ]
  }
}

build(tasks)
```
Running the task in the terminal:
```
gulp nodemon
```


### `oni-browser-sync`

`oni-browser-sync` allows you to use browser-sync for development or for debugging live sites

#### Options

The task config object for `oni-browser-sync` is passed directly to `browser-sync`. As a result, all of the `browser-sync` options can be used in the task config object. [See their documentation](https://browsersync.io/docs/options) for details on available options.


#### Sample Configuration

```js
// gulpfile.js

var build = require('oni-build')

var tasks = {
  'bundle-js': {
    // task configuration
  },
  'copy': {
    // task configuration
  },
  nodemon: {
    // task configuration
  },
  dev: {
    type: 'oni-sequence',
    sequence: [
      'nodemon',
      'browser-sync'
    ]
  },

  /*
    Assume the nodemon task is running a server on localhost:3000.

    The task below will start a browser-sync server on localhost:3030
    that will serve content from the nodemon server (localhost:3000). The browser-sync
    server will serve files from the 'public' folder and when files change in the
    'public' folder, the browser will be updated (changed html and js files will
    trigger the browser to refresh while changed css files will have the new
    css injected (no refresh)).
  */
  'browser-sync': {
    type: 'oni-browser-sync',
    files: ['public/**/*'],
    serveStatic: ['public'],
    port: 3030,
    proxy: 'http://localhost:3000'
  },
}

build(tasks)
```
Running the task in the terminal:
```
gulp dev
```
