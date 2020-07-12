const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const WorkboxPlugin = require('workbox-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'development',
    devtool: 'source-map',
    stats: 'verbose',
    output: {
      libraryTarget: 'var',
      library: 'Client'
    },
    devServer: {
      contentBase: path.join(__dirname, 'capstone'),
      port: 8080,
      host: 'localhost',
      clientLogLevel: 'trace',
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
      }
    },
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
            {
                test: /\.scss$/,
                use: [ 'style-loader', 'css-loader', 'sass-loader' ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin({
          template: "./src/client/views/index.html",
          filename: "./index.html",
        }),
        new CleanWebpackPlugin({
          dry: true,
          verbose: true,
          cleanStaleWebpackAssets: true,
          protectWebpackAssets: false
        }),
        new CopyPlugin({
          patterns: [
            { from: './src/client/icons', to: 'icons' }
          ],
          options: {
            concurrency: 200,
          },
        }),
    ]
}
