module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
      options: {
        dest: "docs"
      },
      api: {
        src: ["app/components/**/*.js", "!app/components/**/*test.js"]
      }
    }
  });

  // Load the plugin that provides the "docular" tasks.
  grunt.loadNpmTasks('grunt-docular');

  grunt.registerTask('docular', ['docular']);

  // Default task(s).
//  grunt.registerTask('default', ['uglify']);

};