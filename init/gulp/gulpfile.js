// davidgg gulpfile conf
var gulp = require('gulp');

var sass = require('gulp-sass');
var minifyCSS = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');

var concat = require('gulp-concat');
var streamqueue = require('streamqueue');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var taskError = function(error){ console.log(error.toString());this.emit('end'); };


gulp.task('default', ['sass', 'scripts', 'watch']);

// Transform scss to css, minify it and concat all
gulp.task('sass', function() {
  return streamqueue({ objectMode: true },
    gulp.src(['src/raw_css/normalize.css', 'src/raw_css/main.css']),
    gulp.src('src/scss/*.scss').pipe(sass()).on('error', taskError)
    )
  .pipe(minifyCSS())
  .on('error', taskError)
  .pipe(concat('all.css'))
  .pipe(gulp.dest('css'))
  .on('error', taskError);
});

// Uglify JS and concat all
gulp.task('scripts', function() {
  gulp.src(['src/raw_js/plugins.js', 'src/raw_js/main.js'])
  .pipe(uglify())
  .on('error', taskError)
  .pipe(concat('app.js'))
  .pipe(gulp.dest('js'))
  .on('error', taskError);
});

//Minimify HTML
gulp.task('html', function() {
  gulp.src('src/*.html')
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeScriptTypeAttributes: true,
    removeOptionalTags: true,
    minifyJS: true,
    minifyCSS:true
  }))
  .on('error', taskError)
  .pipe(gulp.dest('.'));
});

// Load browser
gulp.task('browser-sync', function() {
  browserSync({
    proxy: "localhost:8000"
  });
});


// Waits for JS AND SCSS changes
gulp.task('watch',['browser-sync'], function(){

  var watcher_js = gulp.watch('raw_js/**/*.js', ['scripts', reload]);
  watcher_js.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  var watcher_sass = gulp.watch('scss/**/*.scss', ['sass', reload]);
  watcher_sass.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

  var watcher_html = gulp.watch('src/*.html', ['html', reload]);
  watcher_html.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

});


