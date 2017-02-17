var gulp = require('gulp');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var jsdoc = require('gulp-jsdoc3');
var webpack = require('gulp-webpack');
var babel = require('gulp-babel');

gulp.task('build', () => {
    return gulp.src('advisor.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(webpack({
            output: {
                filename: 'advisor.js',
                library: 'advisor',
                libraryTarget: 'commonjs2',
            },
        }))
        .pipe(gulp.dest('out/'));
});

gulp.task('docs', (cb) => {
    gulp.src(['*.js', '!test/'], { read: false })
        .pipe(jsdoc({
            'template': 'node_modules/minami',
            'opts': {
                'destination': './docs/'
            }
        }, cb));
});

gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(mocha());
});

gulp.task('pre-test', function () {
  return gulp.src(['*.js', '!test/'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire());
});

gulp.task('coverage', ['pre-test'], function () {
  return gulp.src(['test/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports());
});