var webpack = require('webpack')
var env = process.env.NODE_ENV

var config = {
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  output: {
    library: 'flattenObjectDeep',
    libraryTarget: 'umd'
  },
  plugins: []
}

if (env === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  )
}

module.exports = config
