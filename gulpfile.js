// todo: clean up
// todo: add js concat for angular stuff , in order
// add js concat for libs together with min, injection and bower
// move everything front-end into src vs public?
// get gulp serve dist working
// remove unnecessary dependencies
// use a gulp plugin loader to simplify?
// turn linting back on but make it so it doesnt interrupt the build process
// if there are some small errors

// use env variable dev or prod to grab minified cdn for libs

var gulp = require('gulp');
var autoprefixer = require('autoprefixer');
var maps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var jshint = require('gulp-jshint');
var ngAnnotate = require('gulp-ng-annotate');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var gulpIf = require('gulp-if');
var size = require('gulp-size');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var nodemon = require('gulp-nodemon');
var env = require('gulp-env');
var reload = browserSync.reload;

var srcDir = './public';
var destDir = './dst';

// not using bower yet but i could
// just custom one file can update later
// make sure we do angular files in correct order
var paths = {
  html: './public/partials/*.html',
  img: './public/images/**',
  css: './public/css/*.css',
  scss: './public/sass/**/*.scss',
  js: [
    './public/javascripts/angularApp.js',
    './public/javascripts/services/*.js',
    './public/javascripts/directives/*.js',
    './public/javascripts/controllers/*.js'],
  bower: [
    './public/bower_components/lamejs/lame.min.js',
    './public/bower_components/angular-animate/angular-animate.min.js'
  ],
  lib: './public/javascripts/lib/*.js'
}

gulp.task('sass-dev', function() {
  var processors = [autoprefixer]; // can add more later

  return gulp.src(paths.scss)
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(maps.write('./'))
    .pipe(gulp.dest(srcDir + '/css'))

    // Report size and then stream generated css to browsersync
    .pipe(size({title: 'styles-dev'}))
    .pipe(browserSync.stream());
});

// Compile sass to css dest directory with source maps, minification
gulp.task('sass-min', function() {
  return gulp.src(paths.scss)
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(maps.write('./'))

    // Concatenate
    .pipe(gulp.dest(destDir + '/css'))

    // Report size and then stream generated css to browsersync
    .pipe(size({title: 'styles-min'}))
    .pipe(browserSync.stream());
});

// Minify images and tell us their post-minification sizes
gulp.task('img', function () {
  return gulp.src(paths.img)
    .pipe(imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(destDir + '/images'))
    .pipe(size({title: 'images'}));
});

// Minify javascript and tell us file sizes post-minification
gulp.task('js-min', function () {
  console.dir(paths.js);
  return gulp.src(paths.js)
    // .pipe(maps.init())
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    .pipe(uglify({preserveComments: 'some'}))
    // .pipe(maps.write('./'))
    .pipe(gulp.dest(destDir + '/javascripts'))
    .pipe(size({title: 'scripts'}));
});

// Lint JavaScript
gulp.task('jshint', function() {
  return gulp.src(paths.js)
    .pipe(reload({stream: true, once: true}))
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(gulpIf(!browserSync.active, jshint.reporter('fail')))
});


// just copy html to dest dir
gulp.task('html', function() {
  return gulp.src(paths.html)
    .pipe(gulp.dest(destDir + '/partials'));
});

gulp.task('bower', function() {
  return gulp.src(paths.bower)
    .pipe(gulp.dest(destDir + '/bower_components'));
});

gulp.task('lib', function() {
  return gulp.src(paths.lib)
    // .pipe(maps.init())
    .pipe(uglify())
    // .pipe(maps.write('./'))
    .pipe(gulp.dest(destDir + '/javascripts/lib'));
});


gulp.task('clean', function() {
  return del(destDir);
});

gulp.task('nodemon', function(cb) {
  var started = false;

  return nodemon({
    script: 'app.js',
    debug: true
  }).on('start', function() {
    // to avoid nodemon being started multiple times
    // thanks @matthisk
    if (!started) {
      cb();
      started = true;
    }
  });
});

gulp.task('set-dist-env', function() {
  return env({
    vars: {
      NODE_ENV: 'test-production'
    }
  });
});

// Watch and serve src with browsersync
gulp.task('serve:dev', ['sass-dev', 'nodemon'], function() {
  browserSync.init({
    logPrefix: 'once-upon dev',
    proxy: 'http://localhost:3000',
    port: 7000
    // server: srcDir
  });

  gulp.watch([paths.html], reload);
  gulp.watch([paths.scss], ['sass-dev', reload]);
  gulp.watch([paths.js], [reload]);
  gulp.watch([paths.img], reload);
});

// Clean, build and serve from dst folder with browsersync
// not working yet
// amke sure we serve from the new folder
// so we pass an environment variable to app js
gulp.task('serve:dist', ['build', 'set-dist-env', 'nodemon'], function() {
  browserSync.init({
    logPrefix: 'once-upon dist',
    proxy: 'http://localhost:3000',
    port: 7000
  });

  gulp.watch([paths.html], ['html', reload]);
  gulp.watch([paths.scss], ['sass-min', reload]);
  gulp.watch([paths.js], ['js-min', reload]);
  gulp.watch([paths.img], ['img', reload]);
});

// clean first, then build everything
gulp.task('build', ['clean'], function(cb) {
  runSequence(
    // ['jshint'], // linting first
    ['sass-min', 'html', 'img', 'js-min', 'lib', 'bower'],
    cb // then optional callback
  );
});

gulp.task('default', ['serve:dev']);
