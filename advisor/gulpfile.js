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

gulp.task('docs', () => {
    return gulp.src('*.js', {read: false})
        .pipe(jsdoc({
            'template': 'node_modules/minami',
            'destinaton': './docs/'
        }))
});

gulp.task('test', () => {
    return gulp.src('test/*.js')
        .pipe(mocha());
});

gulp.task('coverage', () => {
    return gulp.src('test/*.js')
        .pipe(istanbul())
        .pipe(mocha({reporter: 'spec'}))
        .pipe(istanbul.writeReports());
});