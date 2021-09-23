module.exports = {
  plugins: ['import'],
  settings: {
    'import/extensions': ['.ts', '.tsx', '.d.ts', '.js', '.jsx'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
  rules: {
    'import/no-dynamic-require': 2,
    'import/no-webpack-loader-syntax': 2,
    'import/no-self-import': 2,
    'import/no-useless-path-segments': 2,
    'import/export': 2,
    'import/no-deprecated': 2,
    'import/no-extraneous-dependencies': 2,
    'import/no-mutable-exports': 2,
    'import/no-commonjs': 2,
    'import/first': 2,
    'import/no-duplicates': 2,
    'import/extensions': [
      2,
      {
        js: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
        png: 'always',
        svg: 'always',
        jpeg: 'always',
        jpg: 'always',
        css: 'always',
      },
    ],
    'import/order': [
      1,
      {
        groups: [['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: './assets/*',
            group: 'sibling',
            position: 'after',
          },
          {
            pattern: './*.module.css',
            group: 'index',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
      },
    ],
    'import/dynamic-import-chunkname': [2, { webpackChunknameFormat: '[a-z-]+' }],
  },
  overrides: [
    {
      files: ['*.js'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
};
