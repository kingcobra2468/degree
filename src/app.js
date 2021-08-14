/* eslint-disable import/no-unresolved */
const restify = require('restify');
const rjwt = require('restify-jwt-community');
const untildify = require('untildify');
const fs = require('fs');

require('dotenv').config();

const options = {
  name: 'rpist',
  version: '1.0.0',
};
const mode = process.env.MODE;

if (mode.toLowerCase() === 'https') {
  options.key = fs.readFileSync(untildify(process.env.KEY_PATH));
  options.cert = fs.readFileSync(untildify(process.env.CERT_PATH));
}

const server = restify.createServer(options);

server.use(restify.plugins.bodyParser({
  mapParams: true,
}));
server.use(rjwt({ secret: process.env.JWT_SECRET })
  .unless({ path: ['/api/auth', '/api/discovery/info'] }));

// import the routess
require('@api/discovery.js')(server);
// require('@api/temperature')(server);
require('@api/errors')(server);
require('@api/auth')(server);

server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('%s listening at %s', server.name, server.url);
});
