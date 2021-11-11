const WorkerPlugin = require('worker-plugin');

module.exports = {
  runtimeCompiler: true ,
  devServer: {
    proxy: {
      '/API/v1.0': {
        target: 'http://192.168.1.100:5000',
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