import { Server } from 'restify';

module.exports = (server: Server) => {
  // Gets service health status
  server.get(
    { name: 'healthcheck', path: '/healthcheck' },
    (req, res, next) => {
      res.send({
        status: 'success',
        data: {
          healthy: true
        }
      });
      return next();
    }
  );
};
