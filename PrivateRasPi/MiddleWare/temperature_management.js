const express = require('express');
const temperature_lib = require('./temperature.js');
const server_utils = require('./server_utils.js');
const bodyParser = require("body-parser");

const serv_utilities = server_utils.server_utils_funcs();

var router = express.Router();
router.use(express.json());

var temperature_sensor_lib = temperature_lib.DallasThermometerLib(find_device = false);

// UTILITY FUNCTION
var returnSruct = function(error = null, temperature = null, unit = null, symbol = null) {

    return {
        "error" : error,
        "temperature" : temperature !== null ? temperature.toFixed(2) : null,
        "unit" : unit,
        "symbol" : symbol
    }
}

// UTILITY FUNCTION
var temperatue_encoded_return  = function(temperature, unit) {

    switch(unit) {

        case 'kelvin':
            return returnSruct(error = null, temperature = temperature_sensor_lib.get_kelvin(temperature), unit = "Kelvin", symbol = "K");
            break;

        case 'celcius':
            return returnSruct(error = null, temperature = temperature_sensor_lib.get_celcius(temperature), unit = "Celcius", symbol = "C");
            break;

        case 'fahrenheit':
            return returnSruct(error = null, temperature = temperature_sensor_lib.get_fahrenheit(temperature), unit = "Fahrenheit", symbol = "F");
            break;

        default:
            return returnSruct(error = "Unsupported conversion unit: " + req.params.scale);
            break;
    }
}

router.get('/get-temperature/:hash/:unit', function(req, res) {
    
    let base64_str = req.headers.authorization;
    let hash = req.params.hash;
    let unit = req.params.unit.toLowerCase();
    let creds = undefined;

    if (base64_str == undefined) {
        
        res.status(401);
        res.json({"error" : "missing auth"});
        res.end();
        return 1;
    }
    
    try {

        creds = serv_utilities.get_credentials(req.headers.authorization);
    }
    
    catch (error) {
        
        res.status(400);
        res.json({"error": error.toString()});
        res.end();
        return 1;   
    }

    serv_utilities.check_rasp_pi_exists(hash, creds.username, creds.password).then((rasp_exists) => {
            
        if (! rasp_exists) {
            
            res.status(403);
            res.json({"error" : "forbidden"});
            res.end()
            return 1;
        }

        serv_utilities.get_rasp_pi_temp(hash).then((rasp_temperature) => { 
                    
            if (rasp_temperature == undefined) {

                res.status(500);
                res.json({"error" : "server error"});
                res.end()
                return 1;
            }
            else {
                
                res.status(200);
                res.json(temperatue_encoded_return(rasp_temperature, unit));
                res.end();
            }
        })
    })
})

router.put('/set-temperature/:hash/:unit', function (req, res) {

    let base64_str = req.headers.authorization;
    let hash = req.params.hash;
    let unit = req.params.unit.toLowerCase();
    let temperature = undefined;
    let creds = undefined;

    if (req.body.temperature == undefined) {

        res.status(400);
        res.json({"error" : "missing temperature"});
        res.end();
        return 1;
    }
    else {

        temperature = req.body.temperature;
        console.log("temp", temperature)
        if (unit == "fahrenheit") {
            temperature = ((temperature - 32) * (5/9)).toFixed(2);
        }
        else if (unit == "kelvin") {
            temperature = (temperature - 273.15).toFixed(2);
        }
    }

    if (base64_str == undefined) {
        
        res.status(401);
        res.json({"error" : "missing auth"});
        res.end();
        return 1;
    }

    try {

        creds = serv_utilities.get_credentials(req.headers.authorization);
        console.log("creds", creds)
    }
    
    catch (error) {
        
        res.status(400);
        res.json({"error": error.toString()});
        res.end();
        return 1;   
    }

    serv_utilities.check_rasp_pi_exists(hash, creds.username, creds.password).then((rasp_exists) => {

        if (! rasp_exists) {

            res.status(400);
            res.json({"error" : "invalid request"});
            res.end();
            return 1;
        }
    
        try {
            
            serv_utilities.set_rasp_pi_temp(hash, temperature);
        }
    
        catch (error) {
            
            res.status(400);
            res.json({"error": error.toString()});
            res.end();
            return 1;   
        }
    
        res.status(200);
        res.json({"Error": ""});
        res.end();
    })
    
})

module.exports = router;
//scalability in the future with id for node thermometers each node will have server running with unique id and main middleware fetches needed node server
//over a certain port scan network (look at code I wrote for suki pi scanner)

