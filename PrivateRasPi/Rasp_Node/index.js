const express = require('express');
const rasp_node_utils_lib = require('./rasp_node_utils.js');
const temperature_lib = require('./temperature.js');

const temperature_sensor_lib = temperature_lib.DallasThermometerLib(find_device = true);
const rasp_node_utils = rasp_node_utils_lib.rasp_node_utils()

const INTERVAL = 5000 //msec 
rasp_node_utils.read_config_file();

console.log(rasp_node_utils.get_my_port())
setInterval(function(){
    
    //rasp_node_utils.upload_temperature_data(parseFloat((Math.random() * 100).toFixed(2)));
    try {
        rasp_node_utils.upload_temperature_data(temperature_sensor_lib.get_celcius());
    }
    catch {
        setTimeout(function() { //sleep for 3 seconds
        }, 3000);
    }

    }, INTERVAL)

