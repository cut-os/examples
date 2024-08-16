const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, 'src/main.js'),
    output: {
        path: path.join(__dirname, 'target'),
        filename: 'js/[name].[chunkhash:6].js'
    },
    devtool: 'source-map',
    devServer: {
        open: true, // 打开浏览器
        port: 5000, // 服务端口号
        hot: true, // 热部署，每次修改js文件只会打包修改的地方
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false, //不将注释提取到单独的文件中
        })],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'demo-fingerprint',
            template: path.join(__dirname, './public/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'style/init.css',
        }),
        new CopyPlugin({
            patterns: [{
                from: path.join(__dirname, './public/config.json'),
                to: './config.json',
                info: {minimized: false},
            }, {
                from: path.join(__dirname, './public/thumbnail.png'),
                to: './thumbnail.png',
                info: {minimized: false},
            },{
                from: path.join(__dirname, './public/fp-a.png'),
                to: './fp-a.png',
                info: {minimized: false},
            },{
                from: path.join(__dirname, './public/fp-b.png'),
                to: './fp-b.png',
                info: {minimized: false},
            }],
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [{
            test: /.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ["@babel/preset-env"]
            }
        }, {
            test: /\.css$/i,
            use: [
                {loader: MiniCssExtractPlugin.loader},
                {loader: 'css-loader'}],
        }, {
            test: /\.(png|jpeg|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    esModule: false,
                    outputPath: 'images', // 图片打包后的路径
                    limit: 4 * 1024, // 小于100kb的图片转为base64
                    name: '[name].[hash:6].[ext]', // 自定义输出文件名
                }
            }],
            type: 'javascript/auto'
        }]
    },
}