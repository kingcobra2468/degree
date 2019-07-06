const express = require('express');
const server_utils = require('./server_utils.js');
const crypto = require('crypto');
const multer = require('multer');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

const serv_utilities = server_utils.server_utils_funcs();

const router = express.Router();
router.use(express.json())
router.use(cookieParser());

// Gemerate 
// rasp pi registers with middleware and get session cookie
// s.get({hostname: "10.0.1.22", port : 9090, path : "/", headers: {'User-Agent':"pi"}}) add current time to date now
router.post('/authorize', function(req, res) {

    let user_agent = req.get('User-Agent');

    if (! serv_utilities.check_auth_client(user_agent)) {
        
        res.status(403);
        res.json({"Error": "Forbidden"});
        res.end();
    }
    else {

        let rasp_pi_hash = req.body.hash;
        let creds = undefined;
        
        if (rasp_pi_hash == undefined) {
            
            res.status(400);
            res.json({"Error": "Missing or Invalid Post Body"});
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
    
        serv_utilities.check_rasp_pi_exists(rasp_pi_hash, creds.username, creds.password).then((rasp_exists) => {

            if (! rasp_exists) {
                serv_utilities.insert_new_rasp_pi(rasp_pi_hash, creds.username, creds.password);
            }
        
            res.status(200);
            res.json({"Error": ""});
            res.end();
        })
    }
   
})

router.post('/check-hash', function(req, res){

    let user_agent = req.get('User-Agent');

    if (! serv_utilities.check_auth_client(user_agent)) {
        
        res.status(403);
        res.json({"Error": "Forbidden"});
        res.end();
    }
    else {

        let rasp_pi_hash = req.body.hash;
        let creds = undefined;
        
        if (rasp_pi_hash == undefined) {
            
            res.status(400);
            res.json({"Error": "Missing or Invalid Post Body"});
            res.end();
            return 1;
        }

        serv_utilities.check_hash_exists(rasp_pi_hash).then((hash_exists) => {

            res.status(200);
            res.json({
                "hash": rasp_pi_hash,
                "hash_exists" : hash_exists ? true : false
            });
            res.end();
            return 0;
            
       })
    }
})


module.exports = router;

/* TODO

In the future, assign the hash to a cookie

*/
/* CREATE COOKIE
var randomNumber=Math.random().toString();
randomNumber=randomNumber.substring(2,randomNumber.length);
res.cookie('hash', serv_utilities.generate_hash(), { maxAge: 900000, httpOnly: true });
console.log('cookie created successfully');
*/