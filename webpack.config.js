const path = require('path');

const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, options) => {
  const isProd = options.mode === 'production';

  return {
    entry: './src/index',
    output: {
      filename: '[name].[contenthash:8].js',
      path: path.join(__dirname, 'dist'),
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
      },
      minimizer: [`...`, new CssMinimizerPlugin()],
    },
    devtool: !isProd ? 'eval-source-map' : false,
    devServer: {
      static: {
        directory: path.join(__dirname, 'public'),
      },
      client: {
        overlay: false,
      },
      compress: true,
    },
    resolve: {
      modules: ['node_modules', path.join(__dirname, 'src')],
      extensions: ['.tsx', '.ts', '.js', '.json'],
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
                plugins: [['polyfill-corejs3', { method: 'usage-global' }]],
              },
            },
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
                onlyCompileBundledFiles: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          sideEffects: true,
          use: [
            isProd ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: {
                  mode: 'local',
                  exportLocalsConvention: 'dashesOnly',
                  localIdentName: isProd ? '[hash:base64:5]' : '[name]__[local]__[hash:base64:5]',
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: {
                    'postcss-nesting': {},
                    ...(isProd && { autoprefixer: { flexbox: 'no-2009' } }),
                  },
                },
              },
            },
          ],
        },
        {
          test: /\.woff2/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:8][ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ids.HashedModuleIdsPlugin(),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'initial',
        fileWhitelist: [/inter400\..+?\.woff2$/],
      }),
      new ForkTsCheckerWebpackPlugin({ eslint: { enabled: !isProd, files: './src/**/*.{ts,tsx}' } }),
      new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' }),
      env.analyzer === 'default' && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
  };
};
