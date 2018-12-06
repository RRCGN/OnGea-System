/**
 * Task to launch browser sync on changes
 *
 * Tasks:
 * - Launch the Server
 */

'use strict';

module.exports = function(gulp, $, config, messages) {
 gulp.task('browser-sync', ['styles', 'scripts'], function() {
    $.browserSync.init({
      // Change as required, also remember to set in theme settings
      proxy: "http://ongea.localhost/",
      port: 3000,
      online: true,
      notify: false,
      ghost: false
      /*proxy: "http://ongea.local",
      port: 3001,
      open: false,
      online: false,
      notify: false,
      ghost: false*/
      /*proxy: "ongea.local",
      notify: true*/
    });
});
};
