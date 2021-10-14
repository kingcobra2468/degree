const jwt = require('jsonwebtoken');
const errs = require('restify-errors');

module.exports = (server) => {
  // Endpoint for generting JWT tocket for accessing protected routes.
  server.post({ name: 'auth', path: '/api/auth' },
    (req, res, next) => {
      if (req.params.secret === undefined || req.params.secret !== process.env.AUTH_SECRET) {
        return next(new errs.UnauthorizedError('invalid secret'));
      }

      const timeNow = Math.floor(new Date() / 1000);
      const token = jwt.sign(
        { id: process.env.DEGREE_ID, iat: timeNow },
        process.env.JWT_SECRET, { issuer: 'rpist' },
      );
      res.send({ jwt: token });

      return next();
    });
};