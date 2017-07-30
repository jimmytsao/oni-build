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
`src` | `String | Array<String>` | - |File path(s) to the SCSS files that need to be linted
`bemLinter` | `Boolean` | `true` | Check that class names confirm to BEM standards
`bemLinterSrc` | `String | Array<String>` | value provided by `src` | File path(s) to SCSS files that should be BEM Linted

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
`src` | `String | Array<String>` | - |File path(s) of the entry point(s) to the SCSS project
`dest` | `String | Array<String>` | - | Destination folder(s) for the compiled CSS
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
`src` | `String | Array<String>` | - |File path(s) of the entry point(s) to the bundle
`dest` | `String | Array<String>` | - | Destination folder(s) for the compiled bundle
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
`sources` | `Array`<br>`<{ src: String | Array<String>,` <br>`dest: String | Array<String> }>` | - | An array defining the files to copy and their destinations

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
`src` | `String | Array<String>` | - |File path(s) and/or folders to delete

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
`sequence` | `Array<String | sequence>` | - | The list of tasks to run and the sequence in which they should run in. Tasks defined in an Array will run in parallel and will all need to be completed before moving onto the next task

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

  // 'delete' will run first
  // 'lint-styles' will run after 'delete' is complete
  // 'compile-styles' and 'bundle-js' will both run after 'lint-styles' is complete
  // 'copy' will run after both 'compile-styles' and 'bundle-js' are complete
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
`sources` | `Array`<br>`<{ src: String | Array<String>,` <br>`sequence: Array <String | Array<String>> }>` | - | An array defining the files to watch and a sequence of tasks to run when those files change. The sequence is defined the same way as `sequence` in the `oni-sequence` task

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
