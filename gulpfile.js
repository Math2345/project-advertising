var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var sass = require('gulp-sass');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
var browserSync = require("browser-sync").create();
var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var stripCssComments = require('gulp-strip-css-comments');


function style() {
    return gulp.src('draft/sass/**/*.sass')
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 4 versions']
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('public/css/'))
        .pipe(browserSync.reload({stream: true}))
}

function strip() {
    return gulp.src('./public/css/style.css')
        .pipe(stripCssComments())
        .pipe(gulp.dest('./public/css'))
}

function template() {

    return gulp.src("./draft/*.html")
        .pipe(htmlmin({
            collapseWhitespace: true, // удаляем все переносы
            removeComments: true // удаляем все комментарии
        }))
        .pipe(gulp.dest("./public/"));
}

function libmin() {
    return gulp.src([
        './draft/lib/**/*.js'
    ])
        .pipe(concat('lib.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/")); //сохраняем
}

function scriptmin() {
    return gulp.src([
        './draft/js/**/*.js'
    ])
        .pipe(uglify())
        .pipe(gulp.dest("./public/js/"));
}

function minJS() {
    return gulp.src([
        './public/js/lib.min.js',
        './public/js/main.js'
    ])
        .pipe(concat('script.js'))
        .pipe(gulp.dest("./public/js/"))
}

function watcher() {
    gulp.watch('./draft/sass/**/*.sass', style);
    gulp.watch('./draft/*.html', template).on('change', browserSync.reload);
    gulp.watch("./draft/js/**/*.js", scriptmin).on('change', browserSync.reload);
}




gulp.task('sass', style);
gulp.task('strip', strip);
gulp.task('htmlmin', template);
gulp.task('scriptmin', scriptmin);
gulp.task('libmin', libmin);
gulp.task('minJS', minJS);



gulp.task('dev', function () {
  browserSync.init({ // Выполняем browserSync
    server: { // Определяем параметры сервера
      baseDir: './public' // Директория для сервера - app
    },
    notify: false // Отключаем уведомления в браузере
  });
});


gulp.task('watch', watcher);




gulp.task('default', function(cb) {
  gulp.parallel([
       style,
       strip,
       template,
       libmin,
       scriptmin,
       minJS,
       watcher,
      'dev',
])(cb)
});




