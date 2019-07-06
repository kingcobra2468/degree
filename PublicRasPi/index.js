const express = require('express');

const PORT = 9000;

var server = express();
var get_temperature = require('./get_temperature.js');

server.use('/temperature', get_temperature);

server.get("*", function(req, res) {
    
    res.send("<h1>ERROR 404:</h1>\n<i>Invalid Path: " + req.path + "</i>");
});

server.listen(PORT);

//scalability in the future with id for node thermometers each node will have server running with unique id and main middleware fetches needed node server
//over a certain port scan network (look at code I wrote for suki pi scanner)