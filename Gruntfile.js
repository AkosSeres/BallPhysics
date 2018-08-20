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
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: grunt.file.readJSON('package.json').jshintConfig
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'concat', 'babel']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('test', ['jshint']);

    grunt.registerTask('default', ['jshint', 'concat', 'babel', 'uglify']);

};