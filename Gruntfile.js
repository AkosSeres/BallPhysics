module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      default: {
        tsconfig: './tsconfig.json',
      },
    },
    eslint: {
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'src/**/*.ts',
      ],
      options: {
        useEslintrc: true,
      },
    },
  });

  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('build', [
    'eslint',
    'ts',
  ]);

  grunt.registerTask('test', ['eslint']);
};
