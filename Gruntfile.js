module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    ts: {
      default: {
        tsconfig: './tsconfig2.json',
      },
    },
    browserify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.js': 'src/physics.ts',
        },
      },
      options: {
        browserifyOptions: {
          standalone: 'BallPhysics',
          debug: true,
        },
        plugin: ['tsify'],
      },
    },
    babel: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
        },
      },
    },
    uglify: {
      options: {
        banner:
          '/*! <%= pkg.name %> ' +
          '<%= grunt.template.today("dd-mm-yyyy") %> */\n',
        mangle: true,
        beautify: false,
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.min.js',
        },
      },
    },
    eslint: {
      target: [
        'Gruntfile.js',
        'src/**/*.js',
        'test/**/*.js',
        'src/**/*.ts',
        'test/**/*.ts',
      ],
      options: {
        useEslintrc: true,
      },
    },
    watch: {
      files: ['<%= eslint.target %>'],
      tasks: ['eslint', 'browserify', 'babel'],
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-babel');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-ts');

  grunt.registerTask('build', [
    'eslint',
    'browserify',
    'babel',
    'uglify',
    'ts',
  ]);

  grunt.registerTask('test', ['eslint']);

  grunt.registerTask('default', ['eslint', 'browserify', 'babel', 'uglify']);
};
