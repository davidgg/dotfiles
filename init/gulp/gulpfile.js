var gulp = require('gulp');

var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

var concat = require('gulp-concat');
var streamqueue = require('streamqueue');

var gulpif = require('gulp-if');
var del = require('del');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var taskError = function(error){ console.log(error.toString());this.emit('end'); };

var src={
  js:   "src/js/*.js",
  scss: "src/scss/**/*.scss",
  html: "src/html/**/*.html",
  img: "src/img/**",
  reset_css: ['src/css/normalize.css', 'src/css/main.css'],
  prev_js: ['src/js/prev/plugins.js'],
  vendor: ['src/js/vendor/**/*.js']
};

var config = {
  production: true
}

var local_address = "localhost:8000";

gulp.task('set-development', function(){config.production = false;});
gulp.task('dev', ['set-development', 'clean', 'sass', 'scripts', 'img', 'browser-sync', 'watch']);
gulp.task('default', ['clean', 'sass', 'scripts', 'img']);


// Transform scss to css, minify it and concat all
gulp.task('sass', function() {
  return streamqueue({ objectMode: true },
    gulp.src(src.reset_css),
    gulp.src(src.scss).pipe(sass()).on('error', taskError)
    )
  .pipe(gulpif(config.production, minifyCSS()))
  .on('error', taskError)
  .pipe(concat('all.css'))
  .pipe(gulp.dest('css'))
  .on('error', taskError);
});

// Uglify JS and concat all
gulp.task('scripts', function() {

  gulp.src(src.vendor)
  .pipe(gulp.dest('js/vendor'));

  return streamqueue({ objectMode: true },
    gulp.src(src.prev_js),
    gulp.src(src.js)
    )
  .pipe(gulpif(config.production, uglify()))
  .on('error', taskError)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('js'))
  .on('error', taskError);

});

//Minimify HTML
gulp.task('html', function() {
  gulp.src(src.html)
  .pipe(gulpif(config.production, htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeOptionalTags: true,
    minifyJS: true,
    minifyCSS:true
  })))
  .on('error', taskError)
  .pipe(gulp.dest('.'));
});

gulp.task('img', function(){
  gulp.src(src.img)
  .pipe(gulp.dest('img'));
});

gulp.task('clean', function(){
  del.sync([
    'img/*',
    'css/*',
    'js/*'
    ]);
});

// Load browser
gulp.task('browser-sync', function() {
  browserSync({
    proxy: local_address
  });
});


// Waits for JS AND SCSS changes
gulp.task('watch', function(){

  var watcher_js = gulp.watch(src.js, ['scripts', reload]);
  watcher_js.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  var watcher_sass = gulp.watch(src.scss, ['sass', reload]);
  watcher_sass.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  var watcher_html = gulp.watch(src.html, ['html', reload]);
  watcher_html.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

});
