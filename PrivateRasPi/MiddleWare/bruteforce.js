var check_auth_client = function(agent) {

    for (let i = 0; i < 255; i++){
        for (let j = 0; j < 255; j++){
            for (let k = 0; k < 255; k++){
                let d = (function() { // 112
                    return ((((((255 >> 2) + k) << 6) & 63) ^ 31) ^ 255) >> 1 >>> 0
                })() 
            
                let e = (function() { // 45
                    return ((((114 >> 2) & 109) ^ i) ^ 69) ^ 20
                })()
                
                let f = (function() { //67
                    return ((((j & 104) ^ 31) ^ 50) - 2)
                })()
            
                if (((d == e + f) && (e % 15 == 0) && (f >> 5 == 2))) {
                    console.log(d, " ", e, " ", f, " ");
                    break;
                }
                }
            }
        }

}
check_auth_client("s")