'use strict';

var request = require('request');

module.exports = function (grunt) {
  // show elapsed time at the end
  require('time-grunt')(grunt);
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var reloadPort = 35729, files;

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    develop: {
      server: {
        file: 'bin/www'
      }
    },
    sass: {
      dist: {
        options:{
          compass: true
        },
        files: {
          'assets/src/css/hexacar.css': 'assets/src/scss/site/hexacar.scss'
        }
      }
    },
    cssmin: {
      options:{
        sourceMap:true
      },
      dist:{
        files:{
          'assets/build/css/hexacar.min.css': ['assets/src/css/hexacar.css']
        }
      }
    },
    copy:{
      img:{
        expand: true,
        cwd: 'assets/src/img',
        src: '**',
        dest: 'assets/build/img'
      }
    },
    watch: {
      options: {
        nospawn: true,
        livereload: reloadPort
      },
      server: {
        files: [
          'bin/www',
          'app.js',
          'routes/*.js'
        ],
        tasks: ['develop', 'delayed-livereload']
      },
      js: {
        files: ['assets/src/js/*.js'],
        options: {
          livereload: reloadPort
        }
      },
      css: {
        files: [
          'assets/src/scss/**/*.scss'
        ],
        tasks: ['sass','cssmin'],
        options: {
          livereload: reloadPort
        }
      },
      imgs: {
        files: ['assets/src/img/*.*'],
        tasks: ['copy'],
        options: {
          livereload: reloadPort
        }
      },
      views: {
        files: ['templates/**/*.ejs'],
        options: {
          livereload: reloadPort
        }
      }
    }
  });

  grunt.config.requires('watch.server.files');
  files = grunt.config('watch.server.files');
  files = grunt.file.expand(files);

  grunt.registerTask('delayed-livereload', 'Live reload after the node server has restarted.', function () {
    var done = this.async();
    setTimeout(function () {
      request.get('http://localhost:' + reloadPort + '/changed?files=' + files.join(','),  function (err, res) {
          var reloaded = !err && res.statusCode === 200;
          if (reloaded) {
            grunt.log.ok('Delayed live reload successful.');
          } else {
            grunt.log.error('Unable to make a delayed live reload.');
          }
          done(reloaded);
        });
    }, 500);
  });

  grunt.registerTask('default', [
    'sass',
    'cssmin',
    'copy',
    'develop',
    'watch'
  ]);
};
