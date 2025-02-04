const gulp = require('gulp');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const log = require('fancy-log');
import { deleteAsync as del } from 'del';

// Clean old minified files
async function clean() {
    await deleteAsync(['dist/ion-floating-menu.min.js', 'dist/ion-floating-menu.min.css']);
    log('🗑️  Old minified files removed!');
}

// Minify & concatenate JavaScript
function minifyJS() {
    return gulp.src('./dist/*.js')
        .pipe(uglify())
        .pipe(concat('ion-floating-menu.min.js'))
        .pipe(gulp.dest('dist/'))
        .on('end', () => log('✔️ JS Minified!'));
}

// Minify & concatenate CSS
function minifyCSS() {
    return gulp.src('./dist/*.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(concat('ion-floating-menu.min.css'))
        .pipe(gulp.dest('dist/'))
        .on('end', () => log('✔️ CSS Minified!'));
}

// Define build task
exports.build = gulp.series(clean, minifyJS, minifyCSS);
exports.default = exports.build;
