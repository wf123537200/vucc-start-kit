'use strict'

var fs = require("fs");
var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var vue = require("vue-loader");
var isProduction = function() {
    return process.env.NODE_ENV == 'production';
};

function getEntry() {
    var fileList = [];
    var res = {};
    var srcPath = './src/views';

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
        return it.match(/index\.js/);
    });

    //console.log(fileList);

    fileList.forEach(function(it) {
        var path = it.substr(srcPath.length);
        res[path.substr(0, path.length - 3)] = [it];
    });

    return res;
};

//webpack插件
var plugins = [
    // new ExtractTextPlugin("style.css", {
    //     allChunks: true,
    //     disable: false
    // })
];

var entry = getEntry(),

    cdnPrefix = "",

    publishPath = cdnPrefix + "/dist/",
    buildPath = path.resolve(__dirname, './dist');

//生产环境js压缩和图片cdn
if (isProduction()) {
    //plugins.push(new webpack.optimize.UglifyJsPlugin());

    cdnPrefix = cdnPrefix + "/dist/",

    publishPath = cdnPrefix;
}
//编译输出路径
module.exports = {
    debug: true,
    entry: entry,
    output: {
        path: './dist',
        filename: '[name].js',
        publicPath: '/dist',
        chunkFilename:"[id].build.js?[chunkhash]"
    },
    externals: {
    },
    module: {
        loaders: [{
            test: /\.vue$/,
            loader: 'vue',
        }, {
            test: /\.scss$/,
            loader: "style-loader!css-loader?sourceMap!cssnext-loader"
            // 抽离css
            // loader: ExtractTextPlugin.extract(
            //     "style-loader", 'css-loader?sourceMap!sass-loader!cssnext-loader')
        }, {
            test: /\.css$/,
            loader: "style-loader!css-loader?sourceMap!cssnext-loader"
            // 抽离css
            // loader: ExtractTextPlugin.extract(
            //     "style-loader", "css-loader?sourceMap!cssnext-loader")
        }, {
            test: /\.js$/,
            loader: 'babel',
            query: {
                compact: false,
                presets: ['es2015'],
                plugins: ['transform-runtime']
            },
            exclude: /node_modules/
        },{
            test: /\.(jpg|png|gif)$/,
            loader: "file-loader?name=images/[hash].[ext]"
        }, {
            test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
            loader : 'url'
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    vue: {
        css: ExtractTextPlugin.extract("css"),
        sass: ExtractTextPlugin.extract("css!sass-loader")
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        //别名
        alias: {
            filter: path.join(__dirname, 'src/filters'),
            service: path.join(__dirname, 'src/service'),
            components: path.join(__dirname, 'src/components'),
            src: path.join(__dirname, 'src'),
            lib: path.join(__dirname, 'src/libraries')
        }
    },
    plugins: plugins
    //devtool: '#source-map'
};
