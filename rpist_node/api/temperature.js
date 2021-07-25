function Temperature(server) {
    server.get({ name: 'get-kelvin', path: '/api/temp/get-kelvin' },
        function (req, res, next) {
            res.send({ 'temp': 1 });
            return next();
        });

    server.get({ name: 'get-celsius', path: '/api/temp/get-celsius' },
        function (req, res, next) {
            res.send({ 'temp': 1 });
            return next();
        });

    server.get({ name: 'get-fahrenheit', path: '/api/temp/get-fahrenheit' },
        function (req, res, next) {
            res.send({ 'temp': 1 });
            return next();
        });
};

module.exports = Temperature;