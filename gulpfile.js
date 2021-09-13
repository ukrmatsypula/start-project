"use strict";

const { src, dest, parallel, watch } = require("gulp");
const server = require("browser-sync").create();
const concat = require("gulp-concat");
const uglify = require("gulp-uglify-es").default;
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const cleancss = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const webp = require("gulp-webp");
const plumber = require("gulp-plumber");
const panini = require("panini");
const del = require("gulp-clean");

var path = {
  src: {
    html: "src/*.html",
    js: "src/js/*.js",
    css: "src/scss/*.scss",
    images: "src/img/**/*.{jpg,jpeg,svg,png,gif,ico}",
    fonts: "src/fonts/**/*.{eot,svg,ttf,woff,woff2}",
  },

  build: {
    html: "dist/",
    js: "dist/js/",
    css: "dist/css/",
    images: "dist/img/",
    fonts: "dist/fonts/",
  },

  watch: {
    html: "src/**/*.html",
    js: "src/js/**/*.js",
    css: "src/scss/**/*.scss",
    images: "src/img/**/*.{jpg,jpeg,svg,png,gif,ico}",
    fonts: "src/fonts/**/*.{eot,svg,ttf,woff,woff2}",
  },

  clean: "./dist",
};

function html() {
  panini.refresh();
  return src(path.src.html)
    .pipe(
      panini({
        root: "src/",
        layouts: "src/layouts/",
        partials: "src/partials/",
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
      })
    )
    .pipe(dest(path.build.html));
}

function serve() {
  server.init({
    server: {
      baseDir: "./dist",
      notify: false,
      online: true,
    },
  });
}

function scripts() {
  return src(path.src.js)
    .pipe(concat("app.min.js"))
    .pipe(uglify())
    .pipe(dest(path.build.js));
}

function styles() {
  return src(path.src.css)
    .pipe(plumber())
    .pipe(eval("sass")())
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowsersList: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(
      cleancss({
        level: {
          1: { specialComments: 0 },
        },
        // format: "beautify",
      })
    )
    .pipe(dest(path.build.css));
}

function images() {
  return (
    src(path.src.images)
      .pipe(newer(path.build.images))
      .pipe(imagemin())
      // .pipe(webp())
      .pipe(dest(path.build.images))
  );
}

function clean() {
  return src(path.clean, { read: false }).pipe(del());
}

function startWatch() {
  watch([path.watch.js, "!src/**/*.min.js"], scripts).on(
    "change",
    server.reload
  );
  watch(path.watch.html, html).on("change", server.reload);
  watch(path.watch.css, styles).on("change", server.reload);
  watch(path.watch.images, images).on("change", server.reload);
}

exports.html = html;
exports.scripts = scripts;
exports.styles = styles;
exports.images = images;
exports.clean = clean;
exports.startWatch = startWatch;
exports.serve = serve;

exports.default = parallel(html, styles, scripts, images, startWatch, serve);
