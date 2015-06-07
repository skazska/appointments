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
    }
  });

  // Load the plugin that provides the "docular" tasks.
  grunt.loadNpmTasks('grunt-ngdocs');
  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask('docs', ['ngdocs']);

  // Default task(s).
//  grunt.registerTask('default', ['uglify']);

};