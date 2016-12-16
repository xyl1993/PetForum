module.exports = function(grunt) {
    // 配置
    grunt.initConfig({
        pkg : grunt.file.readJSON('package.json'),
        concat : {
            domop : {
                src: [
                      ],
                dest: 'main/jsmin/main.min.js'
            },
            css : {
                src: ['resources/css/wfe.css','ry_resources/css/ry.css'],
                dest:'dist/css/ry.css'
            }
        },
        clean: {
          tests: ['dist/*.js']
        },
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build : {
                src : 'dist/ry_domop.js',
                dest : 'dist/ry_domop.min.js'
            }
        },
        cssmin: {
            css: {
                src:'ry_resources/css/*.css',
                dest:'ry_resources/css/ry.min.css'
            }
        }
    });
    // 载入concat和uglify插件，分别对于合并和压缩
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-css');
    // 注册任务
    grunt.registerTask('default', ['clean','concat:domop']);//uglify
    grunt.registerTask('css', ['cssmin']);//'concat:css',
}; 