var gulp            = require('gulp'),
    autoprefixer    = require('gulp-autoprefixer'),
    cache           = require('gulp-cache'),
    clean           = require('gulp-clean'),
    concat          = require('gulp-concat'),
    csslint         = require('gulp-csslint'),
    jshint          = require('gulp-jshint'),
    livereload      = require('gulp-livereload'),
    minifycss       = require('gulp-minify-css'),
    plumber         = require('gulp-plumber'),
    rename          = require('gulp-rename'),
    sass            = require('gulp-ruby-sass'),
    stylish         = require('jshint-stylish'),
    uglify          = require('gulp-uglify');


gulp.task('styles', function(){
    return sass(['src/scss/*.scss'], {
            style: 'compressed'
        })
        .pipe(gulp.dest('dist/css/'))
});

gulp.task('js-lib', function(){
    return gulp.src('src/js/lib/*.js')
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('js-custom', function(){
    return gulp.src('src/js/custom/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js/'));
});

gulp.task('watch', function(){
    gulp.watch('src/scss/*.scss', ['styles']);
    gulp.watch('src/js/lib/*.js', ['js-lib']);
    gulp.watch('src/js/custom/*.js', ['js-custom']);
});

gulp.task('default', ['styles', 'js-lib', 'js-custom', 'watch'], function(){});
