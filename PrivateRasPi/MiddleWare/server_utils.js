const sqlite3 = require('sqlite3')
const crypto = require('crypto')

module.exports.server_utils_funcs = function() {

    var sqlite3_obj;
    
    sqlite3_obj = new sqlite3.Database('rasp_pi_identities.db', sqlite3.OPEN_READWRITE, function(error) {
        //Check if db exists
        if (error != null){
            if (error.code == 'SQLITE_CANTOPEN'){
            
                sqlite3_obj = new sqlite3.Database('rasp_pi_identities.db');
                sqlite3_obj.run(`CREATE TABLE Rasp_Nodes(rasp_hash INTEGER(64) PRIMARY KEY NOT NULL, username TEXT DEFAULT '', 
                    password TEXT DEFAULT '', last_temp INTEGER NOT NULL DEFAULT -99999, last_used INTEGER NOT NULL DEFAULT -1)`);
            }
        }
    });

    // use unix time - year 2038 bug? or use run_time for safety?
    var cur_unix_time = function() {
        return Date.now();
    }

    var cur_run_time = function() {
        return process.uptime();
    }

    var generate_hash = function() {

        let current_date = (new Date()).valueOf().toString();
        let random = Math.random().toString();
        return crypto.createHash('sha1').update(current_date + random).digest('hex');
    }

    var check_auth_client = function(agent) {

        let buffer = Buffer.from(agent);

        // REMOVE REFERENCE BEFORE RELEASE
        let a = buffer.readInt8(2); // -
        let b = buffer.readInt8(0); // p
        let c = buffer.readInt8(1); // i

        let d = (function() { // 112
            return ((((((((255 >> 2) + a) << 6) & 63) ^ 31) ^ 255) >> 1) >>> 0)
        })() 

        let e = (function() { // 45
            return (((((114 >> 2) & 109) ^ b) ^ 69) ^ 20)
        })()
        
        let f = (function() { //67
            return ((((c & 104) ^ 31) ^ 50) - 2)
        })()

        return (((d == e + f) && (e % 15 == 0) && (f >> 5 == 2)) ? true : false)
    }
    
    var check_rasp_pi_exists = function(hash, username = '', password = '') {

        let result = false;
        var query = sqlite3_obj.prepare("SELECT COUNT(*) AS count FROM Rasp_Nodes WHERE rasp_hash=(?) AND username=(?) AND password=(?)");
        
        return new Promise((resolve, reject) => {
            
            query.get([hash, username, password],  function(error, data) {
            result = data.count > 0 ? true : false;
            //console.log(result)
            resolve(result);
            
        })}).then(function(rasp_exists){
            return rasp_exists;
        });

    }

    var check_hash_exists = function(hash) {

        let result = false;
        var query = sqlite3_obj.prepare("SELECT COUNT(*) AS count FROM Rasp_Nodes WHERE rasp_hash=(?)");
        
        return new Promise((resolve, reject) => {
            
            query.get([hash],  function(error, data) {
            result = data.count > 0 ? true : false;
            console.log(hash);
            resolve(result);
            
        })}).then(function(rasp_exists){
            return rasp_exists;
        });

    }

    var insert_new_rasp_pi = function(hash, username = '', password = '') {

        var query = sqlite3_obj.prepare("INSERT INTO Rasp_Nodes(rasp_hash, username, password, last_used) VALUES((?),(?),(?),(?))");
        query.run([hash, username, password, cur_unix_time()]);

    }

    var set_rasp_pi_temp = function(hash, temperature) {

        console.log(typeof temperature)
        if ( typeof temperature != 'number') {

            throw new Error("Temperature is invalid format");
        }

        var query = sqlite3_obj.prepare("UPDATE Rasp_Nodes SET last_temp=(?), last_used=(?) WHERE rasp_hash=(?)");
        
        query.run([temperature, cur_unix_time(), hash]);

    }

    var get_rasp_pi_temp = function(hash) {

        let temperature = undefined;


        return new Promise((resolve, reject) => {
            
            var query = sqlite3_obj.prepare("SELECT last_temp FROM Rasp_Nodes WHERE rasp_hash=(?)");
            
            query.get([hash], function(error, data) {
                
                temperature = data.last_temp != -99999 ? data.last_temp : undefined;
                resolve(temperature);
            })
        }).then(function(temperature){
            
            return temperature;
        });
            
    }

    var get_credentials = function(base64_str) {

        let base64_regex_pattern = RegExp('^BASIC ([A-Z]|[a-z]|[0-9]|[+/=]){1,}$');

        if (! base64_regex_pattern.test(base64_str)) {
            throw new Error("BASE64 encoded input is incorrectly formatted.");
        }

        let base64_credentials = base64_str.split(' ')[1]
        let decoded_base64_credentials = new Buffer(base64_credentials, 'base64').toString();
        let [username, password] = ['', ''];
        if (decoded_base64_credentials != ":") {
            [username, password] = new Buffer(base64_credentials, 'base64').toString().split(":");
        }
        else{
        }

        return {
            "username" : username,
            "password" : password
        }
    }

    return {

        generate_hash : function() {
            return generate_hash();
        },
        check_auth_client : function(agent) {
            return check_auth_client(agent);
        },
        get_credentials : function(base64_str) {
            return get_credentials(base64_str);
        },
        check_rasp_pi_exists : function(hash, username='', password='') {
            return check_rasp_pi_exists(hash, username, password);
        },
        check_hash_exists : function(hash) {
            return check_hash_exists(hash);
        },
        insert_new_rasp_pi : function(hash, username='', password='') {
            return insert_new_rasp_pi(hash, username, password);
        },
        set_rasp_pi_temp : function(hash, temperature) {
            return set_rasp_pi_temp(hash, temperature);
        },
        get_rasp_pi_temp : function(hash) {
            return get_rasp_pi_temp(hash);
        },
    }
};