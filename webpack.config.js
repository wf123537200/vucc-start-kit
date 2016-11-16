'use strict'

var fs = require("fs");
var path = require('path');
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var vue = require("vue-loader");
var utils = require('./utils');

var isProduction = function() {
    return process.env.NODE_ENV == 'production';
};

function getEntry() {
    var res = {};

    res['router'] = './src/views/router.js';

    return res;
};

//webpack插件
var plugins = [
    //提公用js到common.js文件中
    //new webpack.optimize.CommonsChunkPlugin('common.js'),
    //将样式统一发布到style.css中
    new ExtractTextPlugin("style.css", {
        allChunks: true,
        disable: false
    })
];

var entry = getEntry(),

    cdnPrefix = "",

    publishPath = cdnPrefix + "/dist/",
    buildPath = path.resolve(__dirname, './dist');

//生产环境js压缩和图片cdn
if (isProduction()) {
    cdnPrefix = cdnPrefix + "这里是cdn路径";

    publishPath = cdnPrefix;
}
//编译输出路径
module.exports = {
    debug: true,
    entry: entry,
    output: {
        path: buildPath,
        filename: '[name].js',
        publicPath: publishPath,
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
            loader: ExtractTextPlugin.extract(
                "style-loader", 'css-loader?sourceMap!sass-loader!cssnext-loader')
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract(
                "style-loader", "css-loader?sourceMap!cssnext-loader")
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
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&minetype=application/font-woff"
        }, {
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader"
        }, {
            test: /\.json$/,
            loader: 'json'
        }, {
            test: /\.(html|tpl)$/,
            loader: 'html-loader'
        }]
    },
    vue: {
        loaders: utils.cssLoaders()
    },
    resolve: {
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        //别名
        alias: {
            service: path.join(__dirname, 'src/service'),
            components: path.join(__dirname, 'src/components'),
            src: path.join(__dirname, 'src'),
            lib: path.join(__dirname, 'src/libraries')
        }
    },
    plugins: plugins
};
