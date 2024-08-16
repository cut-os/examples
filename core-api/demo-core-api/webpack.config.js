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
        open: true, //Open browser
        port: 5000, // Service port number
        hot: true, // Hot deployment, every time you modify the js file, only the modified parts will be packaged
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({
            extractComments: false, //Don't extract comments into separate files
    })],
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'demo-core-api',
            template: path.join(__dirname, './public/index.html'),
        }),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [{
                from: path.join(__dirname, './public/config.json'),
                to: './config.json',
                info: {minimized: false},
            }, {
                from: path.join(__dirname, './public/thumbnail.png'),
                to: './thumbnail.png',
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
                {loader: 'css-loader'}
            ],
        }, {
            test: /\.(png|jpeg|jpg|gif)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    esModule: false,
                    outputPath: 'images', // The path of the packaged image
                    limit: 4 * 1024, // Convert images smaller than 100kb to base64
                    name: '[name].[hash:6].[ext]', // Custom output file name
                }
            }],
            type: 'javascript/auto'
        }]
    },
}
