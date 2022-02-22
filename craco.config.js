const webpack = require('webpack');

module.exports = {
  reactScriptsVersion: "react-scripts" /* (default value) */,
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      ]
    }
  }
};
