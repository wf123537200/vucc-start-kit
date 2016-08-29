'use strict'

const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const del = require('del');


function getEntry() {
    var fileList = [];
    var res = {};
    var srcPath = './src/views';
    var LIB_PRE_FIX = './src/libraries/';

    function walk(path){
        var dirList = fs.readdirSync(path);
        dirList.forEach(function(item){
            if(fs.statSync(path + '/' + item).isDirectory()){
                walk(path + '/' + item);
            }else{
                fileList.push(path + '/' + item);
            }
        });
    }

    walk(srcPath);

    fileList = fileList.filter(function(it) {
        return it.match(/config\.json/);
    });


    fileList.forEach((it) => {
        console.log(it + ' is package ing...');

        fs.readFile(it, (err, data) => {
            if(err) throw err;

            // get files
            const jsonObj = JSON.parse(data);
            let resList = [];
            if(!jsonObj.common) return;
            jsonObj.common.forEach((it) => {
                resList.push(LIB_PRE_FIX + it);
            });

            // set path
            var path = it.substr(srcPath.length);

            //console.log(resList);
            //console.log(path.substr(0, path.length - 11));

            gulp.src(resList)
                .pipe(concat('common.js'))
                .pipe(rename('common.js'))
                .pipe(uglify())
                .pipe(gulp.dest('dist' + path.substr(0, path.length - 11)));
        });
    });

    return res;
};

/**
 *  清理生产目录文件
 */
gulp.task('clean', function(cb) {
    del(['./dist/*']).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

gulp.task('create-comjs', ['clean'], function() {
    const res = getEntry();
});



