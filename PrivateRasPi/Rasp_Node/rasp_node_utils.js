const fs = require('fs');
const crypto = require('crypto')
const request = require('request');

module.exports.rasp_node_utils = function() {

    var parent_base_url = undefined;
    var parent_port = undefined;
    var my_port = undefined;
    var my_hash = undefined;
    var my_user_agent = undefined;
    var creds = {
        username : "",
        password : "",
    }

    var get_parent_base_url = function() {
        return parent_base_url; 
    }

    var get_parent_port = function() {
        return parent_port;
    }

    var get_my_port = function() {
        
        return my_port;
    }

    var get_my_hash = function() {
        return my_hash;
    }

    var get_my_user_agent = function() {
        return my_user_agent;
    }

    var set_parent_base_url = function(parent_base_url_input) {
        parent_base_url = parent_base_url_input; 
    }

    var set_parent_port = function(parent_port_input) {
        parent_port = parent_port_input;
    }

    var set_my_port = function(my_port_input) {
        my_port = my_port_input;
        console.log(my_port, " ", Date.now())
    }

    var set_my_hash = function(my_hash_input) {
        my_hash = my_hash_input;
    }

    var set_my_user_agent = function(my_user_agent_input) {
        my_user_agent = my_user_agent_input;
    }

    var set_creds = function(username, password) {
        creds.username = username;
        creds.password = password;
    }

    var generate_hash = function() {

        let current_date = (new Date()).valueOf().toString();
        let random = Math.random().toString();
        return crypto.createHash('sha1').update(current_date + random).digest('hex');
    }

    var str_to_base64 = function(input_str) {

        return Buffer.from(input_str).toString('base64');
    }

    var check_hash = function(hash) {
        
        let options = {
            json: {
              hash: hash
            },
            headers : {
                'User-Agent' : my_user_agent,
                "Content-Type": "application/json"
        }}

        return new Promise ((resolve,reject) => {
    
            console.log(parent_base_url + ':' + parent_port + '/auth/check-hash')
            request.post(parent_base_url + ':' + parent_port + '/auth/check-hash', options, (error, response, body) => {
                
                console.log(error)
                if (response.statusCode == 200) {
                    resolve(body.hash_exists);
                }
                else {
                    throw new Error("Error checking hash status: " + response.statusCode + " " + response.statusMessage)
                }
            })

        }).then((hash_exists) => {
            return hash_exists;
        })
    }
    
    var upload_temperature_data = function(temperature) {
        
        let options = {
            json: {
              temperature: temperature //temperature_sensor_lib.get_celcius()
            },
            headers : {
                'User-Agent' : my_user_agent,
                "Content-Type": "application/json",
                "Authorization": "BASIC " + str_to_base64(creds.username + ":" + creds.password)
        }}

        request.put(parent_base_url + ':' + parent_port + '/temp/set-temperature/' + get_my_hash() + '/celcius', options, (error, response, body) => {
                
            if (response.statusCode == 200) {
                return 0;
            }
            else {
                throw new Error("Error setting temperature: status" + response.statusCode + " " + body.error)
            }
        })

    }

    // KEEP WORKING ON THIS 
    var read_config_file = function(path_to_config = "./config.json") {
        
        if (! fs.existsSync(path_to_config)) {
            throw new Error ("config.json file could not found");
        }

        let raw_bytes = fs.readFileSync(path_to_config);
        let config_properties = JSON.parse(raw_bytes);

        set_parent_base_url(config_properties.parent_base_url);
        set_parent_port(config_properties.parent_port);
        set_my_port(config_properties.my_port);
        set_my_user_agent(config_properties.user_agent);
        set_creds(config_properties.username, config_properties.password);

        if (config_properties.hash == '') {

            var setup_rasp_hash = async function() {
                
                let temp_hash = generate_hash();
                
                await check_hash(temp_hash).then((hash_exists) => {

                    if (hash_exists) {
                        setup_rasp_hash();
                    }
                    else {
                        set_my_hash(temp_hash);
                        config_properties.hash = my_hash;
                        fs.writeFile(path_to_config, JSON.stringify(config_properties, null, 4));
                        set_my_hash(config_properties.hash)
                    }
                })
            }

            setup_rasp_hash();
        }
        else {
            set_my_hash(config_properties.hash)
        }
    }

    return {
        get_parent_base_url : function() {
            return get_parent_base_url();
        },
        get_parent_port : function() {
            return get_parent_port();
        },
        get_my_port : function() {
            return get_my_port();
        },
        get_my_user_agent : function() {
            return get_my_user_agent();
        },
        upload_temperature_data : function(temperature) {
            upload_temperature_data(temperature);
        }, 
        read_config_file : async function(path_to_config) {
            await read_config_file(path_to_config);
        }
    }
}
