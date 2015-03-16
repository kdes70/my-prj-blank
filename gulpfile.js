var gulp = require('gulp'),
    wiredep = require('wiredep').stream;
    useref = require('gulp-useref'), // ставит в build блоки оптемизырованые css, js
    gulpif = require('gulp-if'), // фильтрует подключаные к index.html файлы
    uglify = require('gulp-uglify'), // минифицирует js файлы
    minifyCss = require('gulp-minify-css'), // минифицирует css файлы
    clean = require('gulp-clean'),
    sftp = require('gulp-sftp'),
    imagemin = require('gulp-imagemin'), // Оптимизация изображений
    pngquant = require('imagemin-pngquant'),
    webserver = require('gulp-webserver'),
    deploy = require("gulp-gh-pages"); // GitHub

// webserver
gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});

// imagemin Оптимизация изображений
gulp.task('imagemin', function () {
    return gulp.src('app/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images/'));
});

// hosting SFTP !утачнить данные у хостера
gulp.task('hosting', function () {
    return gulp.src('dist/**/*')
        .pipe(sftp({
            host: '176.57.216.2',
            user: 'kdes70',
            pass: '9qMiOWpC',
            remotePath: '/kdes70.tmweb.ru/public_html/tests/'
        }));
});

// clean Очищаем папку dist
gulp.task('clean', function () {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

// build  собираем файлы на продакшен
gulp.task('build', ['clean'], function () {
    var assets = useref.assets();
    return gulp.src('app/*.html')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist'));

});

// bower вывод на index.html все bower компаненты
gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep({
        directory: "app/bower_companents"
    }))
    .pipe(gulp.dest('./app'));
});



var options = {
    remoteUrl: "https://github.com/kdes70/my-prj-blank",
    branch: "master"};
gulp.task('deploy', function () {
    gulp.src("dist/**/*.*")
        .pipe(deploy(options));
});

// задача на отслеживание
gulp.task('watch', function(){
    gulp.watch('bower.json', ['bower']);
});

gulp.task('default', ['build','imagemin', 'watch']);
