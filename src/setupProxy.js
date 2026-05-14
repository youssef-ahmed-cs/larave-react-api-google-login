// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      // Forward API requests to the Laravel host used in development (devhub.test).
      // Ensure devhub.test resolves to your Laravel server and NOT to the CRA dev server.
      target: 'https://devhub.test',
      changeOrigin: true,
      secure: false,
    })
  );
};