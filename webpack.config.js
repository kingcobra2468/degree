const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');
const ShebangPlugin = require('webpack-shebang-plugin');

module.exports = {
  mode: 'development',
  target: 'node',
  entry: './src/app.ts',
  parallelism: 25,
  resolve: {
    modules: ['src', path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      '@api': path.resolve(__dirname, 'src', 'api'),
      '@lib/sensors': path.resolve(__dirname, 'src', 'lib/sensors'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['*', '.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'degree.js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader'
      },
    ],
  },
  plugins: [
    new ShebangPlugin(),
    new Dotenv({ path: './src/.env' }),
    new ESLintPlugin({ fix: true, extensions: ['ts'] }),
  ],
};
