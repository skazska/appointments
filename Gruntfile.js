module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
      options: {
        dest: "docs"
      },
      api: {
        src: ["app/components/*/*.js", "!app/components/test/*"]
      }
    },
    concat: {
      options: {
        separator: ";\n"
      },
      dist: {
        src:["app/components/szs-board/szs-board.js",
          "app/components/szs-key-list/szs-key-list.js",
          "app/components/szs-dash-search/szs-dash-search.js"
        ],
        dest: "dist/szs-dash-search.js"
      }
    },
    copy: {
      main: {
        files: [
          // includes files within path
          {src: ['app/templates'], dest: 'dist/templates'}
        ]
      }
    },
    less: {
      production: {
        options: {
          paths: ["app/components/*"],
        },
        files: {
          "dist/szs-dash-search.css": "app/app.less"
        }
      }
    }
  });

  // Load the plugin that provides the "docular" tasks.
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('docs', ['ngdocs']);
  grunt.registerTask('build', ['concat', 'copy', 'less']);

  // Default task(s).
//  grunt.registerTask('default', ['uglify']);

};