"use strict";

module.exports = function (grunt) {
  const sass = require("sass");

  require("time-grunt")(grunt);
  require("jit-grunt")(grunt, {
    useminPrepare: "grunt-usemin",
  });

  grunt.initConfig({
    sass: {
      options: {
        implementation: sass,
        sourceMap: true,
      },
      dist: {
        files: {
          "assets/css/styles.css": "assets/css/styles.scss",
        },
      },
    },
    copy: {
      html: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "./",
            src: ["*.html"],
            dest: "dist",
          },
        ],
      },
      fonts: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: "node_modules/@fortawesome/fontawesome-free",
            src: ["webfonts/*.*"],
            dest: "dist/assets",
          },
        ],
      },
    },
    clean: {
      build: {
        src: ["dist/"],
      },
    },
    useminPrepare: {
      foo: {
        dest: "dist",
        src: ["index.html"],
      },
      options: {
        flow: {
          steps: {
            css: ["cssmin"],
            js: ["uglify"],
          },
          post: {
            css: [
              {
                name: "cssmin",
                createConfig: function (context, block) {
                  var generated = context.options.generated;
                  generated.options = {
                    keepSpecialComments: 0,
                    rebase: false,
                  };
                },
              },
            ],
          },
        },
      },
    },
    concat: {
      options: {
        separator: ";",
      },
      // dist configuration is provided by useminPrepare
      dist: {},
    },
    uglify: {
      // dist configuration is provided by useminPrepare
      dist: {},
    },
    cssmin: {
      // It we don't specify this, the useminPrepare will not work correctly.
      dist: {},
    },

    /*
     Adds additional extensions to the main name.
     Circumvent problems that browsers cache your main.css and main.js so that
     your both files are not the most updated.
     */
    filerev: {
      options: {
        encoding: "utf8",
        algorithm: "md5",
        length: 20,
      },

      release: {
        // filerev:release hashes(md5) all assets (images, js and css )
        // in dist directory
        files: [
          {
            src: ["dist/assets/js/*.js", "dist/assets/css/*.css"],
          },
        ],
      },
    },

    /*
    Usemin
    Replaces all assets with their revved version in html and css files.
    options.assetDist contains the directories for finding the assets
    according to their relative paths.
    */
    usemin: {
      html: ["dist/index.html"],
      options: {
        assetsDirs: ["dist", "dist/assets/css", "dist/assets/js"],
      },
    },

    /*
    htmlmin is run after usemin because 'usemin' will replace all
    scripts into main.js and CSS codes into main.css, so htmlmin will
    be preformed on the resulting html files after usemin has completed the work.
     */
    htmlmin: {
      dist: {
        options: {
          // All white spaces in html files will be gone.
          collapseWhitespace: true,
        },
        files: {
          // Directory of files.
          "dist/index.html": "dist/index.html", // 'destination': 'source'
        },
      },
    },
    watch: {
      files: "assets/css/*.scss",
      tasks: ["sass"],
    },
    browserSync: {
      dev: {
        bsFiles: {
          src: ["assets/css/*.css", "*.html", "assets/js/*.js"],
        },
        options: {
          watchTask: true,
          server: {
            baseDir: "./",
          },
        },
      },
    },
  });

  grunt.registerTask("css", ["sass"]);
  grunt.registerTask("default", ["browserSync", "watch"]);
  grunt.registerTask("build", [
    "clean",
    "copy",
    "useminPrepare",
    "concat",
    "cssmin",
    "uglify",
    "filerev",
    "usemin",
    "htmlmin",
  ]);
};
