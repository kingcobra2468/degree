/* eslint-disable import/no-unresolved */
const restify = require('restify');
const rjwt = require('restify-jwt-community');
require('dotenv').config();

const server = restify.createServer({
  name: 'rpist',
  version: '1.0.0',
});

server.use(rjwt({ secret: process.env.SECRET })
  .unless({ path: ['/api/auth', '/api/discovery/info'] }));

// import the routess
require('@api/discovery.js')(server);
require('@api/temperature')(server);
require('@api/errors')(server);
require('@api/auth')(server);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('%s listening at %s', server.name, server.url);
});
