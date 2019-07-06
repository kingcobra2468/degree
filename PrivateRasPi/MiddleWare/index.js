const express = require('express');
const temperature_lib = require('./temperature.js');
const bodyParser = require("body-parser");

const PORT = 9090;
const auth = require('./authentication.js');
const temp_management = require('./temperature_management.js');
var server = express();

server.use('/auth', auth);
server.use('/temp', temp_management);

server.use(express.json());

server.use(function(req, res, next) {
    // SET UP FOR LOGGING user agent, request type, hostname, etc.. LATER

    let a = req.get('User-Agent');
    console.log(a, req.baseUrl+req.url);
    
})

server.get("*", function(req, res) {  
    res.send("<h1>ERROR 404:</h1>\n<i>Invalid Path: " + req.path + "</i>");
});

server.listen(PORT);

//scalability in the future with id for node thermometers each node will have server running with unique id and main middleware fetches needed node server
//over a certain port scan network (look at code I wrote for suki pi scanner)

/*

 curl -X POST -H "Content-Type: application/json" -H "Content-Type: application/json" -H "User-Agent: pi-asdas" -H "Authorization: BASIC ZXJpazpwYXNzd29yZA==" -d '{"hash":"cfefd32dabde77644be0b7b4bdbc4fe51164836d"}' http://10.0.1.22:9090/auth/authorize

 curl -X POST -H "Content-Type: application/json" -H "Content-Type: application/json" -H "User-Agent: pi-asdas" -H "Authorization: BASIC Og==" -d '{"hash":"cfefd32dabde77644be0b7b4bdbc4fe51164836d"}' http://10.0.1.22:9090/auth/authorize
 
*/