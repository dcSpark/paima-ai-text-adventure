const path = require('path');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const webpack = require('webpack');
require('dotenv').config({ path: `./../../.env.${process.env.NETWORK_ENV}` });

if (!process.env.CHAIN_URI || !process.env.BACKEND_URI || !process.env.CHAIN_ID)
  throw new Error('Please ensure you have filled out your .env file');

module.exports = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'public/dist/'),
    filename: 'bundle.js',
    publicPath: '/public/dist/',
  },
  devServer: {
    static: path.resolve(__dirname, './public'),
    host: 'localhost',
    port: 9000,
    historyApiFallback: true,
    open: true,
    devMiddleware: {
      index: true,
      // publicPath: '/public',
      serverSideRender: true,
      writeToDisk: true,
    },
  },
  plugins: [
    new NodePolyfillPlugin(),

    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, 'src'),
        loader: 'ts-loader',
      },
      {
        // SCSS (SASS) Loader
        test: /\.s[ac]ss$/i,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }],
      },
      {
        // css Loader
        test: /\.css$/i,
        use: [{ loader: 'css-loader' }],
      },
      {
        test: require.resolve('phaser'),
        loader: 'expose-loader',
        options: { exposes: { globalName: 'Phaser', override: true } },
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      { test: /\.json$/, type: 'json' },
      {
        // Assets loader
        // More information here https://webpack.js.org/guides/asset-modules/
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
        // generator: {
        //   filename: 'assets/[hash][ext][query]',
        // },
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.jsx', '.css'],

    alias: {
      '@src': path.resolve(__dirname, 'src/'),
      '@assets': path.resolve(__dirname, 'src/assets/'),
    },

    fallback: {
      assert: false,
      fs: false,
      stream: false,
      crypto: false,
      url: false,
    },
  },
};
