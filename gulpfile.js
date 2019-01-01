//Gọi gulp vào để sử dụng
var gulp = require("gulp")

//Cài đặt các plugin
var sass = require("gulp-sass")
var pug = require("gulp-pug")
var postcss = require("gulp-postcss")
var autoprefixer = require("autoprefixer")
var cssnano = require("cssnano")
var concat=require('gulp-concat')
var sourcemaps = require("gulp-sourcemaps")
var browserSync = require("browser-sync").create()

//Browser-sync
gulp.task('browser-sync', function () {

    browserSync.init({
        watch: true,
        server: "app/dist"
    })
    gulp.watch('app/src/styles/**/*.sass', gulp.series('sass'));
    gulp.watch('app/src/templates/**/*.pug', gulp.series('pug'));
    gulp.watch('app/src/scripts/**/*.js', gulp.series('javascript'))
    gulp.watch('app/src/img/*',gulp.series('copy-img'))
    gulp.watch('app/dist/*.html').on('change', browserSync.reload);
})
//Biên dịch file PUG sang HTML
gulp.task('pug', function buildHTML() {
    return gulp.src('app/src/templates/*.pug')
        .pipe(pug())
        .pipe(gulp.dest('app/dist'))
        .pipe(browserSync.stream())

})
//Biên dịch các file SASS sang CSS
gulp.task('sass', function () {
    return gulp.src('app/src/styles/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/dist/css'))
        .pipe(browserSync.stream())

});
//
gulp.task('javascript', function () {
    return gulp.src('app/src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        // .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('app/dist/scripts'));
});

//Coppy image
gulp.task('copy-img', function () {
    return gulp.src([
            'app/src/img/**.*',
        ])
        .pipe(gulp.dest('app/dist/img'));
});
//Concat css
gulp.task('concat-css', function () {
    return gulp.src([
            'bower_components/font-awesome/css/font-awesome.min.css',
            'bower_components/animate.css/animate.min.css',
            // OWL
            'bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
            'bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',
        ],{ allowEmpty: true })
        .pipe(concat('thuvien.css'))
        .pipe(gulp.dest('./app/dist/css'));
});
//concat js
gulp.task('concat-js', function () {
    return gulp.src([
            'bower_components/jquery/dist/jquery.slim.min.js',
            'bower_components/popper.js/dist/umd/popper.min.js',
            'bower_components/bootstrap/dist/js/bootstrap.min.js',
            // Phần Plugins
            'bower_components/owl.carousel/dist/owl.carousel.min.js',
        ],{ allowEmpty: true })
        .pipe(concat('thuvien.js'))
        .pipe(gulp.dest('./app/dist/js'));
});

//Đặt các task về mặc định
gulp.task('default', gulp.series('pug', 'sass','javascript','copy-img','concat-css','concat-js','browser-sync'))