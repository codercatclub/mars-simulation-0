const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'src/index.html',
          to: '.',
        },
        {
          from: 'src/about.html',
          to: '.',
        },
        {
          from: 'assets',
          to: 'assets',
        },
      ],
    }),
  ],
  performance: {
    maxEntrypointSize: 2000000, // 2MB
    maxAssetSize: 4000000, // 4MB
  },
  devServer: {
    contentBase: './dist',
    // compress: true,
    // disableHostCheck: true,
    // hot: false,
    // inline: false,
    port: 3000,
    host: '0.0.0.0',
    https: true,
  },
};
