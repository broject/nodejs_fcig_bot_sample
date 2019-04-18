'use strict';
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const path = require('path');

var _adminSassInc = path.resolve(__dirname, 'private/themes/admin/scss');
var _adminSass = './private/themes/admin/scss/*.scss';
var _adminSassMain = './private/themes/admin/scss/*.scss';
var _adminCssDest = './public/themes/admin/css/';
var _adminJsPrivate = [
    './private/themes/admin/jss/*.js'
];
var _adminJsPublic = './public/themes/admin/js/';
var _admin_js_name = 'ajs.js';

var _siteSassInc = path.resolve(__dirname, 'private/themes/default/scss');
var _siteSass = './private/themes/default/scss/*.scss';
var _siteSassMain = './private/themes/default/scss/*.scss';
var _siteCssDest = './public/themes/default/css/';
var _siteJsPrivate = [
    './private/themes/default/jss/jishee.js',
    './private/themes/default/jss/scripts.js'
];
var _siteJsPublic = './public/themes/default/js/';
var _site_js_name = 'sjs.js';


var _outputStyle = 'compressed';
var config = {
    sass: {
        style: 'expanded',
        outputStyle: _outputStyle,
        errLogToConsole: true,
        sourceMap: true
    },
    autoprefixer: {
        browsers: ['last 2 versions'],
        cascade: false
    }
};

/**
 * for admin themes
 */
var admin_css_task = function () {
    config.sass.includePaths = _adminSassInc;
    gulp.src(_adminSassMain)
        .pipe(sass(config.sass))
        .pipe(gulp.dest(_adminCssDest));
};
gulp.task('admin-css', admin_css_task);
var admin_js_task = function () {
    gulp.src(_adminJsPrivate)
        .pipe(concat(_admin_js_name))
        .pipe(uglify())
        .pipe(gulp.dest(_adminJsPublic))
};
gulp.task('admin-js', admin_js_task);

/**
 * for site themes
 */
var site_css_task = function () {
    config.sass.includePaths = _siteSassInc;
    gulp.src(_siteSassMain)
        .pipe(sass(config.sass))
        .pipe(gulp.dest(_siteCssDest));
};
gulp.task('site-css', site_css_task);
var site_js_task = function () {
    gulp.src(_siteJsPrivate)
        .pipe(concat(_site_js_name))
        .pipe(uglify())
        .pipe(gulp.dest(_siteJsPublic))
};
gulp.task('site-js', site_js_task);

/**
 * .pipe(sourcemaps.init())
        .pipe(sass(config.sass))
        .pipe(sourcemaps.write({ includeContent: false }))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(autoprefixer(config.autoprefixer))
        .pipe(sourcemaps.write('.'))
 */

gulp.task('watch', function () {
    var changeHandler = function (evt) {
        console.log(
            '[watcher] File ' + evt.path.replace(/.*(?=sass)/, '') + ' was ' + evt.type + ', compiling...'
        );
    };
    
    gulp.watch(_adminSass, function () {
        setTimeout(function () {
            admin_css_task();
        }, 500);
    }).on('change', changeHandler);
    gulp.watch(_adminJsPrivate, admin_js_task);

    gulp.watch(_siteSass, function () {
        setTimeout(function () {
            site_css_task();
        }, 500);
    }).on('change', changeHandler);
    gulp.watch(_siteJsPrivate, site_js_task);
});

gulp.task('run', ['admin-css', 'site-css', 'admin-js', 'site-js', 'watch']);