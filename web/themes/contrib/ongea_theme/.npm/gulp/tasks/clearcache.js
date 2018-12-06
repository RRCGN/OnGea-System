/**
 * Task to Clear all caches
 *
 * Tasks:
 */

'use strict';

module.exports = function(gulp, $, config, messages) {
    gulp.task('clearcache', function() {
        return gulp.src('../templates/**/*.html.twig', {read: false})
        .pipe($.shell([
          config.drush.alias.cr
        ]))
        .pipe($.notify({
          title: "Cache rebuilt",
          message: "Drupal cache rebuilt.",
          onLast: true
        }));//.pipe(done());
          //return cp.spawn('drush', ['cache-rebuild'], {stdio: 'inherit'})
        //.on('close', done);
      });
};
