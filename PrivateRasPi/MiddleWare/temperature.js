const fs = require('fs');
const ps = require('process');


module.exports.DallasThermometerLib = function(find_device = true, device_path = '/sys/bus/w1/devices/') {

    var thermometer_id = null;
    
    var find_temp_sensor = function() {
       
        var sensor_regex_pattern = RegExp('28-*');
        
        try {

            files = fs.readdirSync(device_path);
            
            for (var file of files){
                if (sensor_regex_pattern.test(file)) {
                    thermometer_id = file;
                }
            }

            if (thermometer_id == null) {
                throw ("Thermometer not found in ${device_path}")
            }

        } catch (error) {
            
            console.log(error);
            ps.abort();
        }
    }

    var get_raw_temperature = function() {

        let temp_reading = 0;

        try{
            //add support for custom path
            buffer = fs.readFileSync(device_path + thermometer_id + "/" + "w1_slave");
            
            temp_start_index = buffer.indexOf("t=", 0, "ascii") + 2;
            temp_end_index = buffer.length - 1;
            temp_reading = buffer.slice(temp_start_index, temp_end_index).toString();
            temp_reading = parseInt(temp_reading)/1000;
            return temp_reading;

        }
        catch (error) {

            console.log(error);
            ps.abort();
        }
    }

    var get_celcius = function(temperature = get_raw_temperature()) {

        return temperature;
    }

    var get_fahrenheit = function(temperature = get_raw_temperature()) {

        return (temperature * (9/5)) + 32;
    }

    var get_kelvin = function(temperature = get_raw_temperature()) {

        return temperature + 273.15;
    }

    if (find_device) {

        if (device_path[device_path.length -1] != '/')
        device_path += '/'  

        if (device_path !== '/sys/bus/w1/devices/'){

            fs.access(device_path + "", (err) => {
                if (err != null) throw (err)
            })
        }

        find_temp_sensor();
    }

    return {

        get_temperature : function() {
            
            let temperature = get_raw_temperature();

            return {
                "celcius" : get_celcius(temperature),
                "fahrenheit" : get_fahrenheit(temperature),
                "kelvin" : get_kelvin(temperature)
            }
        },
        get_celcius: function(temp) {
            return get_celcius(temp);
        },
        get_fahrenheit : function(temp) {
            return get_fahrenheit(temp);
        },
        get_kelvin : function(temp) {
            return get_kelvin(temp);
        }

    }

};

