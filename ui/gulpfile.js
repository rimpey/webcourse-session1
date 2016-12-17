
//** VARIABLES

var gulp = require('gulp');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
// automatically loads plugins in the package.json
var plugins = require('gulp-load-plugins')();

var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');



// ** DEVELOPMENT TASKS

// compile sass to css with sourcemaps
// gulp.task('sass', function () {
//   return gulp
//     .src('src/sass/main.scss')
//     .pipe(plugins.sourcemaps.init())
//     .pipe(plugins.sass())
//     .pipe(plugins.sourcemaps.write())
//     .pipe(gulp.dest('src/css'))
//     .pipe(browserSync.stream());
// });

gulp.task('sass', function () {
  return gulp
    .src('src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
});

// initialise browserSync to serve from the src dir
gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'src'
        }
    });
});

// tell browserSync to refresh the browser
gulp.task('refresh', function () {
    browserSync.reload();
});

// files being watched for changes made
gulp.task('watch', function () {
    gulp.watch('src/sass/**/*.scss', ['sass']);
    gulp.watch('src/*.html', ['refresh']);
    gulp.watch('src/js/**/*.js', ['refresh']);
});



// ** DEPLOYMENT TASKS

gulp.task('clean:dist', function () {
  return del('dist');
});

// combines and minifies css and js into single file for each
gulp.task('useref', function () {
    return gulp
        .src('src/*.html')
        .pipe(plugins.useref())
        .pipe(plugins.if('*.js', plugins.uglify()))
        .pipe(plugins.if('*.css', plugins.cssnano()))
        .pipe(gulp.dest('dist'));
});

// copy and optimise images
gulp.task('images', function () {
    return gulp
        .src('src/img/**/*.+(png|jpg|gif|svg)')
        .pipe(plugins.imagemin())
        .pipe(gulp.dest('dist/img'));
});

// copy fonts
gulp.task('fonts:dist', function () {
    return gulp
        .src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
});


// ** RUN TASKS

// array of tasks being performed when gulp task run from cmdline
gulp.task('default', ['sass', 'browserSync', 'watch']);

// deployment tasks run in specified order, one at a time
// tasks contained in square brackets can run at the same time
gulp.task('dist', function () {
    runSequence('clean:dist', 'sass', ['useref', 'images', 'fonts:dist']);
});