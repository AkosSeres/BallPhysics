module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        browserify: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': 'src/physics.js',
                },
            },
            options: {
                browserifyOptions: {
                    standalone: 'Physics',
                },
            },
        },
        babel: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.js',
                },
            },
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> ' +
                    '<%= grunt.template.today("dd-mm-yyyy") %> */\n',
                mangle: true,
                beautify: false,
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': 'dist/<%= pkg.name %>.js',
                },
            },
        },
        eslint: {
            target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
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

    grunt.registerTask('test', ['eslint']);

    grunt.registerTask('default', ['eslint', 'browserify', 'babel', 'uglify']);
};
