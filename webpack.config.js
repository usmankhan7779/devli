
const path = require('path');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
// const TerserPlugin = require('terser-webpack-plugin');
// const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
  mode: "none",
  entry: {
    server: './src/server.ts'
  },
  optimization: {
    minimize: false
    // minimizer: [
    //   new TerserPlugin({
    //     parallel: true,
    //     terserOptions: {
    //       keep_classnames: true,
    //       keep_fnames: true
    //     }
    //   })
    // ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'main.server': path.join(__dirname, 'dist', 'server', 'main.js'),
      'environment': path.join(__dirname, 'src', 'environments', 'environment' + (process.env.NODE_ENV && process.env.NODE_ENV === 'dev' ? '' : '.' + process.env.NODE_ENV))
    }
  },
  target: 'node',
  externals: [
    /(node_modules|main\..*\.js)/,
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
    jsonpFunction: 'jsonpFunction',
    library: 'lineupsApp',
    pathinfo: false
  },
  module: {
    noParse: /polyfills-.*\.js/,
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader'
      }
    ]
  },
  plugins: [
    new NormalModuleReplacementPlugin(
      /swiper.js/,
      path.resolve(__dirname, 'src/server-mocks/mock-swiper-js.js')
    ),
    new NormalModuleReplacementPlugin(
      /popover.js/,
      path.resolve(__dirname, 'src/server-mocks/popover.mock.js')
    ),
    new NormalModuleReplacementPlugin(
      /chart.js/,
      path.resolve(__dirname, 'src/server-mocks/chart-mock.js')
    ),
    new NormalModuleReplacementPlugin(
      /chartjs-plugin-datalabels/,
      path.resolve(__dirname, 'src/server-mocks/chart-mock.js')
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?angular(\\|\/)core(.+)?/,
      path.join(__dirname, 'src'), // location of your src
      {} // a map of your routes
    ),
    new webpack.ContextReplacementPlugin(
      // fixes WARNING Critical dependency: the request of a dependency is an expression
      /(.+)?express(\\|\/)(.+)?/,
      path.join(__dirname, 'src'),
      {}
    ),
    new webpack.DefinePlugin({
      ngDevMode: false,
      ngI18nClosureMode: false
    })
  ]
};
