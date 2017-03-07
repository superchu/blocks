const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'source-maps',
  context: `${__dirname}/src`,
  entry: './index.ts',
  output: {
    filename: 'blocks.js',
    path: `${__dirname}/dist`,
    publicPath: '/dist/'
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    loaders: [
      {
        test: /.tsx?$/,
        loader: 'babel-loader!ts-loader',
        include: `${__dirname}/src`
      }
    ]
  }
}
