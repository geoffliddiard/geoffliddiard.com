var gulp     = require('gulp'),
    stylus   = require('gulp-stylus'),
    jeet     = require('jeet'),
    rupture  = require('rupture'),
    pug      = require('gulp-pug'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    jshint   = require('gulp-jshint'),
    usemin   = require('gulp-usemin'),
    cssmin   = require('gulp-cssmin'),
    imgmin   = require('gulp-imagemin'),
    minHtml  = require('gulp-minify-html'),
    cdnizer  = require('gulp-cdnizer'),
    rev      = require('gulp-rev'),
    del      = require('del'),
    connect  = require('gulp-connect'),
    sequence = require('run-sequence'),
    spawn    = require('child_process').spawn;


/**
 * CSS
 */
gulp.task('css', function() {

    return gulp
        .src('./src/styl/style.styl')
        .pipe(stylus({
            use     : [jeet(),rupture()],
            linenos : false,
            compress: false
        }))
        .pipe(gulp.dest('./src/css'))
        .pipe(connect.reload());
});

/**
 * JS
 */
gulp.task('js', function() {

    return gulp
        .src('./src/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
});

/**
 * HTML
 */
gulp.task('html', function (){

    return gulp
        .src('./src/templates/index.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest('./src'))     
        .pipe(connect.reload());
});

/**
 * Watchers
 */
gulp.task('watch', function (){
    // Stylus
    gulp.watch('./src/styl/**/*.styl', ['css']);
    // JS
    gulp.watch('./src/js/**/*.js', ['js', 'html']);
    // Pug
    gulp.watch('./src/templates/**/*.pug', ['html']);
});

/**
 * Dev server
 */
gulp.task('server', function () {
    connect.server({
        name: 'Dev server',
        root: './src',
        port: 3000,
        livereload: true,
        middleware: function(connect) {
            return [connect().use('/bower_components', connect.static('bower_components'))];
        }
    });
});


/**
 * Minify
 */
gulp.task('usemin', function () {
    gulp
        .src('./src/index.html')
        .pipe(cdnizer({
            files: [
                {
                    file: 'bower_components/jquery/dist/jquery.js',
                    package: 'jQuery',
                    cdn: '//ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js'
                }
            ]
        }))
        .pipe(usemin({
            html: [minHtml({empty:true})],
            css: [cssmin(), 'concat', rev()],
            js: [uglify({mangle:false}), 'concat', rev()]
        }))
        .pipe(gulp.dest('dist/'))
});

/**
 * Compress images
 */
gulp.task('imgmin', function (){
    gulp
        .src('./src/img/**/*')
        .pipe(imgmin())
        .pipe(gulp.dest('dist/img/'))
});

/**
 * Clean
 */
gulp.task('clean', function() {
    del(['dist']);
});

/**
 * Clean
 */
gulp.task('copy', function() {
    gulp
        .src([
            './src/**/*', 
            '!./src/*.html', 
            '!./src/js/**/*', 
            '!./src/css/**/*',
            '!./src/img',
            '!./src/img/**/*',
            '!./src/styl',
            '!./src/styl/**/*',
            '!./src/templates',
            '!./src/templates/**/*'
        ])
        .pipe(gulp.dest('dist/'))
});

/**
 * Build to dist/
 */
gulp.task('build', function (){
    sequence('clean', 'css', 'html', 'copy', 'imgmin', 'usemin');
});

/**
 * Deploy the dist directory to Firebase
 */
gulp.task('deploy', function (){

    // which are already 
    var firebase = spawn('firebase', [
        'deploy',
        '--only',
        'hosting'
    ]);

    // print the output to the console
    firebase.stdout.on('data', function (data) {
        process.stdout.write(String(data));
    });
    // print the errors to the console
    firebase.stderr.on('data', function (data) {
        process.stdout.write(String(data));
    });
    // exit properly (we would call done() here, but that forces run-sequence to end)
    firebase.on('exit', function (code) {
        console.log(code);
    });

});

/**
 * Dev command 
 */
gulp.task('default', function (){
    sequence('css', 'html', 'server', 'watch');
});