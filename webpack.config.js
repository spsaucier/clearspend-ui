const path = require('path')

const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = (env, options) => {
  return {
    entry: './src/index',
    output: {
      filename: '[name].[contenthash:8].js',
      chunkFilename: '[name].[contenthash:8].js',
      path: path.join(__dirname, 'dist'),
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
      },
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      compress: true,
    },
    resolve: {
      modules: ['node_modules', path.join(__dirname, 'src')],
      extensions: ['.tsx', '.ts', '.js', '.json']
    },
    module: {
      rules: [
        {
          test: /\.(ts)x?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                exclude: [/node_modules[\\/]core-js/],
                presets: ['solid'],
                plugins: [['polyfill-corejs3', {method: 'usage-global'}]],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                onlyCompileBundledFiles: true,
              },
            },
          ],
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ids.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({template: './public/index.html'}),
      env.analyzer === 'default' && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  };
}
