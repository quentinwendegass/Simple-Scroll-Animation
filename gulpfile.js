let gulp = require('gulp');
let minifyJS = require('gulp-minify');

const config = {
    distDir: 'dist',
    srcDir: 'src',
    jsPattern: '**/*.js'
};


gulp.task('minify-js', function(){
    return gulp.src(config.srcDir + '/' + config.jsPattern)
        .pipe(minifyJS())
        .pipe(gulp.dest(config.distDir));
});


gulp.task('watch', function() {
    gulp.watch(config.srcDir + '/' + config.jsPattern, ['minify-js']);
});


gulp.task('default', ['minify-js', 'watch']);
