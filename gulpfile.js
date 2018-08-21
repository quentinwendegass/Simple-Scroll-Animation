let gulp = require('gulp');
let minifyJS = require('gulp-minify');
let http = require('http');
let st = require('st');

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

gulp.task('server', function(done) {
    http.createServer(
        st({ path: config.distDir, index: '/examples/index.html', cache: false })
    ).listen(8080, done);
});

gulp.task('default', ['minify-js', 'watch']);
