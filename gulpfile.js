const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const browserSync = require("browser-sync").create();

function style() {
  return gulp
    .src("./src/scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dist/css"))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });

  gulp.watch("./src/scss/**/*.scss", style);
  gulp.watch("./src/*.html").on("change", browserSync.reload);
}

exports.style = style;
exports.watch = watch;
