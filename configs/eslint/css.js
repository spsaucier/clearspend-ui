module.exports = {
  plugins: ['css-modules'],
  rules: {
    'css-modules/no-unused-class': [2, { camelCase: 'dashes-only' }],
    'css-modules/no-undef-class': [2, { camelCase: 'dashes-only' }],
  },
};
