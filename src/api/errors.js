module.exports = (server) => {
  // Endpoint for catching internal errors.
  server.on('InternalServer', (req, res, err, cb) => {
    cb();
  });
};
