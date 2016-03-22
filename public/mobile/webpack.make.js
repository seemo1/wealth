var webpack = require('webpack');
var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function makeWebpackConfig() {
  return {
    entry: [
      './contest/index.js' // require 所有要抱的檔案在這裡
    ],
    devtool: process.env.WEBPACK_DEVTOOL || 'source-map',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'contest-bundle.js'
    },
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        {test: /\.css$/, loader: 'style-loader!css-loader'},
        {test: /\.scss$/, loader: 'style!css!sass'},
        {test: /.(png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=\.]+)?$/, loader: 'url-loader?limit=100000'}
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin(),
      new HtmlWebpackPlugin({
        template: './contest/contest-index.html',
        inject: 'head',
        filename: 'contest-index.html'
      })
    ],
    devServer: {
      contentBase: './dist',
      stats: {
        modules: false,
        cached: false,
        colors: true,
        chunk: false
      },
      historyApiFallback: {
        index: '/mobile/contest/'
      }
    }
  }
};