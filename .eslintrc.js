module.exports = {
  root: true,
  extends: [
    './configs/eslint/base.js',
    './configs/eslint/typescript.js',
    './configs/eslint/import.js',
    './configs/eslint/solid.js',
    './configs/eslint/css.js',
  ],
  parserOptions: {
    ecmaVersion: 2017,
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  settings: {},
  env: {
    browser: true,
    es2017: true,
  },
};
