const fs = require('fs');
const path = require('path');

const glob = require('glob');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const StatoscopeWebpackPlugin = require('@statoscope/webpack-plugin').default;

const DEV_ENV = '.env.dev';
if (fs.existsSync(DEV_ENV)) require('dotenv').config({ path: DEV_ENV });

module.exports = (env, options) => {
  const isProd = options.mode === 'production';

  return {
    entry: './src/index',
    output: {
      filename: '[name].[contenthash:8].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    optimization: {
      runtimeChunk: true,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          commons: {
            name: 'commons',
            test: /_common\/components/,
            reuseExistingChunk: true,
            minChunks: 2,
          },
        },
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
      server: 'spdy',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: process.env.DEV_API || '',
          changeOrigin: true,
          logLevel: 'debug',
          // pathRewrite: { '^/api': '' },
        },
      },
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
                    'postcss-custom-media': { importFrom: 'src/media.css' },
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
        {
          test: /icons\/[a-z-]+\.svg$/,
          type: 'asset/source',
        },
        {
          test: /\.(svg|png)$/,
          exclude: /icons\/[a-z-]+\.svg$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/[hash:8][ext]',
          },
        },
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      isProd &&
        new CopyPlugin({
          patterns: [
            { from: 'public/favicons', to: 'favicons' },
            { from: 'public/browserconfig.xml' },
            { from: 'public/site.webmanifest' },
          ],
        }),
      new webpack.ids.HashedModuleIdsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(options.mode),
        'process.env.STRIPE_PUB_KEY': JSON.stringify(process.env.STRIPE_PUB_KEY),
        'process.env.STRIPE_ACCOUNT': JSON.stringify(process.env.STRIPE_ACCOUNT),
      }),
      new HtmlWebpackPlugin({ template: './public/index.html' }),
      new PreloadWebpackPlugin({
        rel: 'preload',
        include: 'initial',
        fileWhitelist: [/neue-400\..+?\.woff2$/, /telegraf-700\..+?\.woff2$/],
      }),
      new ESLintPlugin({
        files: './src/**/*.{ts,tsx}',
        failOnError: isProd,
        failOnWarning: isProd,
      }),
      new ForkTsCheckerWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        experimentalUseImportModule: true,
        ignoreOrder: true,
      }),
      env.analyzer === 'default' && new CircularDependencyPlugin({ exclude: /node_modules/ }),
      env.analyzer === 'default' && new BundleAnalyzerPlugin(),
      env.analyzer === 'statoscope' &&
        new StatoscopeWebpackPlugin({
          name: 'capital',
          saveTo: '.stats/[name]-[hash].html',
          saveStatsTo: '.stats/[name]-[hash].json',
          additionalStats: glob.sync('.stats/*.json'),
        }),
    ].filter(Boolean),
  };
};
