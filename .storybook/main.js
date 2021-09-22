module.exports = {
  stories: [
    '../src/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
  ],
  babel: async (options) => ({
    ...options,
    presets: [...options.presets, 'solid'],
  }),
};
