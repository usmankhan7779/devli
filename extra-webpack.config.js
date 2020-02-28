'use strict';

const webpack = require('webpack');
const Uglify = require("uglifyjs-webpack-plugin");
module.exports = {
  output: {
    jsonpFunction: 'jsonpFunction',
    library: 'lineupsApp'
  },
  plugins: [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /en-us/),
    new webpack.IgnorePlugin(/\.\/locale$/),
    new Uglify({
      sourceMap: false,
      uglifyOptions: {
        output: {
          comments: false
        }
      }
    }),
    new webpack.DefinePlugin({
      ngDevMode: false,
      ngI18nClosureMode: false
    })
  ]
};
