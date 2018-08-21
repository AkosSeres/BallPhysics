module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': 'src/**/*.js'
                }
            }
        },
        babel: {
            dist: {
                files: {
                    'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>.js'
                }
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                mangle: true,
                beautify: false
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': './dist/ballphysics.js'
                    //['<%= concat.dist.dest %>']
                }
            }
        },
        eslint: {
            target: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                useEslintrc: true
            }
        },
        watch: {
            files: ['<%= eslint.target %>'],
            tasks: ['eslint', 'concat', 'babel']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('test', ['eslint']);

    grunt.registerTask('default', ['eslint', 'concat', 'babel', 'uglify']);

};