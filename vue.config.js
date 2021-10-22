const WorkerPlugin = require('worker-plugin');

module.exports = {
  devServer: {
    proxy: {
      '/API/v1.0': {
        target: 'http://127.0.0.1:5000',
        secure: false,
        changeOrigin: true,
      },
      '/api': {
        target: 'https://xk2.zkllab.com',
        changeOrigin: true,
      },
    },
  },
  configureWebpack: {
    plugins: [
      new WorkerPlugin({
        globalObject: 'self',
      }),
    ],
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      chunks: ['chunk-vendors', 'chunk-common', 'index'],
    },
  },
};