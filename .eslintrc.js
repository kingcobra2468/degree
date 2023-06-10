const path = require('path');

module.exports = {
  env: {
    node: true,
    commonjs: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier'
  ],
  parserOptions: {
    "ecmaVersion": "latest",
    "sourceType": "module",
    project: ['./tsconfig.json']
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'node/no-missing-require': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_[0-9]*' }],
    '@typescript-eslint/no-var-requires': 0,
    'prettier/prettier' : 2
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'webpack.config.js'),
      },
    },
  },
  ignorePatterns: ['dist/*'],
  plugins: [
    '@typescript-eslint',
    'prettier'
  ],
};
