module.exports = (server) => {
  // Endpoint for scanners to use to find RPI's on the network.
  server.get({ name: 'discovery', path: '/api/discovery/info' },
    (req, res, next) => {
      res.send({
        id: process.env.DEGREE_ID,
      });
      return next();
    });
};
