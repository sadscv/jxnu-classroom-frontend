
module.exports = {
  devServer: {
    proxy: {
      '/API/v1.0': {
      target: 'http://127.0.0.1:5000',
      // target: 'http://111.111.111.210:5001',
      // target: 'http://fgc.im:5001',
      secure: false,
      changeOrigin: true,
      },
      '/api': {
        target: 'https://xk2.zkllab.com',
        changeOrigin: true,
      },
    },
  },
};
