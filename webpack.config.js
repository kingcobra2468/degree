const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  mode: 'development',
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/app.js',
  resolve: {
    modules: ['src', path.resolve(__dirname, 'node_modules'), 'node_modules'],
    alias: {
      '@api': path.resolve(__dirname, 'src', 'api'),
      '@sensors': path.resolve(__dirname, 'src', 'sensors'),
      '@utils': path.resolve(__dirname, 'src', 'utils'),
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['*', '.js'],
  },
  output: {
    filename: 'rpistNode.js',
    path: path.join(__dirname, '/dist'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new Dotenv({path: './src/.env' }),
    new ESLintPlugin({ fix: true, extensions: ['js'] }),
  ],
};
