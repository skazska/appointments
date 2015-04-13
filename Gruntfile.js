module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ngdocs: {
      options:{
        dest:"docs"
      },
      api:{
        src: ["app/components/**/*.js", "!app/components/**/*test.js"]
      }
    }
  });

  // Load the plugin that provides the "ngdocs" task.
  grunt.loadNpmTasks('grunt-ngdocs');

  grunt.registerTask('docs', ['ngdocs']);

  // Default task(s).
//  grunt.registerTask('default', ['uglify']);

};