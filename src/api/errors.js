module.exports = (server) => {
  server.on('InternalServer', (req, res, err, cb) => {
    cb();
  });
};
