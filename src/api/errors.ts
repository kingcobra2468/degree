module.exports = (server) => {
  // Endpoint for catching internal errors.
  server.on('InternalServer', (req, res, err, cb) => {
    cb();
  });
  // Endpoint for catching unauthorized errors.
  server.on('UnauthorizedError', (req, res, err, cb) => {
    cb();
  });
};
