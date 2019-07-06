const express = require('express');
const temperature_lib = require('./temperature.js');

var router = express.Router();
var temperature_sensor = temperature_lib.DallasThermometerLib();

var returnSruct = function(error = null, temperature = null, unit = null, symbol = null) {

    return {
        "error" : error,
        "temperature" : temperature !== null ? temperature.toFixed(2) : null,
        "unit" : unit,
        "symbol" : symbol
    }
}

router.get('/get-temperature', function(req, res) {
	
	let response_data;
    let all_unit_temperature = temperature_sensor.get_temperature();

	response_data = {
		"data" : {
			"kelvin" : returnSruct(error = null, temperature = all_unit_temperature.kelvin, unit = "Kelvin", symbol = "K"),
            "celcius" : returnSruct(error = null, temperature = all_unit_temperature.celcius, unit = "Celcius", symbol = "C"),
			"fahrenheit" : returnSruct(error = null, temperature = all_unit_temperature.fahrenheit, unit = "Fahrenheit", symbol = "F") 
		}
    }
    
    res.status(200);
    res.json(response_data);
    res.end();
})


router.get('/:scale', function(req, res) {
    
    let response_data;

    console.log("got new request");
    switch(req.params.scale.toLowerCase()) {

        case 'kelvin':
            response_data = returnSruct(error = null, temperature = temperature_sensor.get_kelvin(), unit = "Kelvin", symbol = "K");
            break;

        case 'celcius':
            response_data = returnSruct(error = null, temperature = temperature_sensor.get_celcius(), unit = "Celcius", symbol = "C");
            break;

        case 'fahrenheit':
            response_data = returnSruct(error = null, temperature = temperature_sensor.get_fahrenheit(), unit = "Fahrenheit", symbol = "F");
            break;

        default:
            response_data = returnSruct(error = "Unsupported conversion unit: " + req.params.scale);
            break;
    }

    res.status(response_data["error"] !== null ? 400 : 200);
    res.json(response_data);
    res.end();
})

module.exports = router;
//scalability in the future with id for node thermometers each node will have server running with unique id and main middleware fetches needed node server
//over a certain port scan network (look at code I wrote for suki pi scanner)
