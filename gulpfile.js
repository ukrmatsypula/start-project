const { src, dest, parallel, series, watch } = require("gulp");
const sass = require("gulp-sass")(require("sass"));

const styles = () => {
  return src("./src/scss/**/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(dest("./app/css/"));
};

exports.styles = styles;
