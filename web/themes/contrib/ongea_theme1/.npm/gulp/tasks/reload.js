/**
 * Task to refresh the page after clearing cache
 *
 * Tasks:
 * - Refresh the page after clearing cache
 */

'use strict';

module.exports = function(gulp, $, config, messages) {
    gulp.task('reload', ['clearcache'], function () {
        $.browserSync.reload({stream:false})
      });
};
