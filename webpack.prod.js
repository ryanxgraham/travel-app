const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/client/index.js',
    mode: 'production',
    output: {
      libraryTarget: 'var',
      library: 'Client'
    },
    optimization : {
      minimize: true,
      minimizer: [new TerserPlugin(), new OptimizeCSSAssetsPlugin({})],
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
          use: [ MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader' ]
        },
      ]
    },
    plugins: [
      new CleanWebpackPlugin({
        dry: true,
        verbose: true,
        cleanStaleWebpackAssets: true,
        protectWebpackAssets: false
      }),
      new HtmlWebPackPlugin({
        template: "./src/client/views/index.html",
        filename: "./index.html",
      }),
      new MiniCssExtractPlugin(),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
      }),
      new CopyPlugin({
       patterns: [
         { from: './src/client/icons', to: 'icons' }
       ],
       options: {
         concurrency: 100,
       },
      }),
    ]
}
