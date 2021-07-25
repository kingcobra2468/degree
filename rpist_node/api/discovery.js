function Discovery(server) {
    server.get({ name: 'get-kelvin', path: '/api/discovery/info' },
        function (req, res, next) {
            res.send({ 'here': 1 });
            return next();
        });
};

module.exports = Discovery;