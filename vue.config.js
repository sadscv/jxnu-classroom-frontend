const WorkerPlugin = require('worker-plugin');

module.exports = {
  runtimeCompiler: true ,
  devServer: {
    proxy: {
      '/API/v1.0': {
        target: 'http://127.0.0.1:5000',
        secure: false,
        changeOrigin: true,
      },
      'http://192.168.1.100:8080': {
        target: 'http://219.229.250.28:8080',
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