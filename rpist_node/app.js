var restify = require('restify');

var server = restify.createServer({
    name: 'myapp',
    version: '1.0.0'
});

require('./api/discovery.js')(server);
require('./api/temperature.js')(server);

server.listen(8080, function () {
    console.log('%s listening at %s', server.name, server.url);
  });