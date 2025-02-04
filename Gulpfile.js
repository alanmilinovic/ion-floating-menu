const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');

// Minify & concatenate JavaScript
function minifyJS() {
    return gulp.src('./dist/*.js') // Source JS files
        .pipe(uglify()) // Minify JS
        .pipe(concat('ion-floating-menu.min.js')) // Concatenate
        .pipe(gulp.dest('dist/')); // Save output
}

// Minify & concatenate CSS
function minifyCSS() {
    return gulp.src('./dist/*.css') // Source CSS files
        .pipe(cleanCSS({ compatibility: 'ie8' })) // Minify CSS
        .pipe(concat('ion-floating-menu.min.css')) // Concatenate
        .pipe(gulp.dest('dist/')); // Save output
}

// Watch for changes (Optional)
function watchFiles() {
    gulp.watch('./dist/*.js', minifyJS);
    gulp.watch('./dist/*.css', minifyCSS);
}

// Define tasks
exports.build = gulp.series(minifyJS, minifyCSS);
exports.watch = gulp.series(exports.build, watchFiles);
exports.default = exports.build;
