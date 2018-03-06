module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    serve: {
      options: {
        port: 8522
      }
    }
  });

  grunt.loadNpmTasks('grunt-serve');

  grunt.registerTask('default', ['serve']);
};
