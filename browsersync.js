// browsersync.js
const browserSync = require('browser-sync').create();

browserSync.init({
    proxy: 'http://localhost:8000',
    files: [
        'src/resources/views/**/*.blade.php',
        'public/build/*.js',
        'public/build/*.css',
    ],
    open: true,
    notify: true,
    reloadDelay: 200,
    watchOptions: {
        ignoreInitial: true,
    },
});
