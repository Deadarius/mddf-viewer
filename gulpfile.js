'use strict';

var gulp =        require('gulp');
var browserify =  require('browserify');
var del =         require('del');
var source =      require('vinyl-source-stream');
var runSequence = require('run-sequence');
var uglify =      require('gulp-uglify');
var rename =      require('gulp-rename');

gulp.task('clean', function(done) {
  del(['dist'], done);
});

gulp.task('browserify', function() {
  return browserify({
      debug: true
    })
    .add('./index.js')
    .bundle()
    .pipe(source('index.js'))
    .pipe(rename('mddf-viewer.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('uglify', function() {
  return gulp.src(['./dist/mddf-viewer.js'])
    .pipe(uglify())
    .pipe(rename('mddf-viewer.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build', function(callback) {
  return runSequence('clean',
                    'browserify',
                    'uglify',
                    callback);
});

gulp.task('default', ['build']);
