var gulp = require("gulp");
var uglify = require('gulp-uglify');
var concat = require("gulp-concat");
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var pipe = require("gulp-pipe");
var watch = require('gulp-watch');
var batch = require('gulp-batch');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

var sassFiles = [
    "./src/sass/**.scss",
    "./node_modules/normalize.css/normalize.css"
];
gulp.task('sass', function () {
    return pipe([
        gulp.src(sassFiles),
        sourcemaps.init(),
        sass({outputStyle: 'compressed'}).on('error', sass.logError),
        autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }),
        concat("style.css"),
        sourcemaps.write('./'),
        gulp.dest('./css'),
        browserSync.stream()
    ]);
});

var jsFiles = [
    './node_modules/jquery/dist/jquery.js',
    './node_modules/vue/dist/vue.js',
    './src/js/**.js'
];
gulp.task('js', function () {
    return pipe([
        gulp.src(jsFiles),
        sourcemaps.init(),
        concat("script.js"),
        uglify({sourceMap:true}),
        sourcemaps.write('./'),
        gulp.dest('./js'),
        browserSync.stream()
    ]);
});

gulp.task('watch', function () {

    browserSync.init({
        server: "./",
        open:false
    });

    var templateFiles =['**/*.html'];
    watch(templateFiles).on('change', browserSync.reload);

    watch(sassFiles, batch(function (events, done) {
        gulp.start('sass', done);
    }));

    watch(jsFiles, batch(function (events, done) {
        gulp.start('js', done);
    }));

});

gulp.task('default', [ "sass","js"]);
