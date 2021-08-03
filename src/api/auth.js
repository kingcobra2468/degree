const jwt = require('jsonwebtoken');

module.exports = (server) => {
  // Endpoint for generting JWT tocket for accessing protected routes.
  server.get({ name: 'auth', path: '/api/auth' },
    (req, res) => {
      const timeNow = Math.floor(+new Date() / 1000);
      const token = jwt.sign(
        { id: process.env.RPIST_ID, iat: timeNow },
        process.env.SECRET, { issuer: 'rpist' },
      );
      res.send({ jwt: token });
    });
};
