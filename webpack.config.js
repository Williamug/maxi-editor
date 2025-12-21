const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    filename: 'maxi-editor.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      name: 'MaxiEditor',
      type: 'umd',
      export: 'default'
    },
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'source-map',
  optimization: {
    minimize: true
  }
};
