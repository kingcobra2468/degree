module.exports = (server) => {
  server.get({ name: 'discovery', path: '/api/discovery/info' },
    (req, res, next) => {
      res.send({
        id: process.env.RPIST_ID,
      });
      return next();
    });
};
