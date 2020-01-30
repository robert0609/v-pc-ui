var baseConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
var path = require('path');

module.exports = merge(baseConfig, {
  devtool: false,
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'vpcui.min.js',
    publicPath: '/dist/',
    library: 'vpcui',
    libraryTarget: 'umd'
  },
  externals: {
    'babel-polyfill': {
      commonjs: 'babel-polyfill',
      commonjs2: 'babel-polyfill',
      amd: 'babel-polyfill'
    },
    'bezier-easing': {
      root: 'BezierEasing',
      commonjs: 'bezier-easing',
      commonjs2: 'bezier-easing',
      amd: 'bezier-easing'
    },
    'v-image-compressor': {
      root: 'vImageCompressor',
      commonjs: 'v-image-compressor',
      commonjs2: 'v-image-compressor',
      amd: 'v-image-compressor'
    },
    'v-utility': {
      root: 'vUtility',
      commonjs: 'v-utility',
      commonjs2: 'v-utility',
      amd: 'v-utility'
    },
    'vue': {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    }
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: false
    }),
    new ExtractTextPlugin('vpcui.min.css'),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
});
