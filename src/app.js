const restify = require('restify');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0',
});

//require('./api/discovery.js')(server);
require('./api/temperature')(server);
require('./api/errors')(server);

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
});
