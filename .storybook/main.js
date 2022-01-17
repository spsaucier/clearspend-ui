const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin').default;

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/**/*.stories.tsx'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  babel: async (options) => ({
    ...options,
    presets: [...options.presets, 'solid'],
  }),
  webpackFinal: async (config, { configType }) => {
    const isProd = configType === 'PRODUCTION';

    return {
      ...config,
      resolve: {
        ...config.resolve,
        modules: [...config.resolve.modules, path.join(__dirname, '..', 'src')],
      },
      module: {
        ...config.module,
        rules: [
          ...config.module.rules.filter((rule) => rule.test?.toString() !== '/\\.css$/'),
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
                      'postcss-custom-media': { importFrom: 'src/media.css' },
                      ...(isProd && { autoprefixer: { flexbox: 'no-2009' } }),
                    },
                  },
                },
              },
            ],
          },
          {
            test: /icons\/[a-z-]+\.svg$/,
            type: 'asset/source',
          },
        ],
      },
      plugins: [...config.plugins, new MiniCssExtractPlugin({ filename: '[name].[contenthash:8].css' })],
    };
  },
};
