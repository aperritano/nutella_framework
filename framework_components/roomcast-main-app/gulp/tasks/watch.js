
/* Notes:
 - gulp/tasks/browserify.js handles js recompiling with watchify
 - gulp/tasks/browserSync.js watches and reloads compiled files
 */

var gulp   = require('gulp');
var config = require('../config');

gulp.task('watch', ['setWatch'], function() {
    gulp.watch(config.less.watch, ['less']);
});
