var readline = require('readline');
var net = require('net');
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var timeout = 5000;

rl.question('IP address: ', (ip) => {
    rl.question('Start Port: ', (port) => {
        rl.question('Port Array (ranging from 1 to 65535): ', (portArray) => {
            console.log(`Your IP address is ${ip}. Start Port is ${port}. Port Array is ${portArray}.`);
            // function parseIP(ip) {
            //     if(ip.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3})/)!=null)  {
            //         ip = ip.match(/(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/);  //clean posible port or http://
            //         return ip.split(".");   //returns [a,b,c,d] array
            //     }
            //     else {
            //         return false;
            //     }
            // };
            // console.log(ip);
            var Ports = Array.from(Array(parseInt(portArray)), (x,i) => i+parseInt(port));
            for (portx in Ports) {
                (function(portx) {
                    var s = new net.Socket();
                    s.setTimeout(timeout, function() { s.destroy(); });
                    s.connect(portx, ip, function() {
                        console.log('OPEN: ' + portx);
                        console.log(s.address())
                    });
                    s.on('data', function(data) {
                        console.log(portx +': '+ data);
                        s.destroy();
                    });
                    s.on('error', function(e) {
                        s.destroy();
                    });
                })(portx);
            }; 
            rl.close();
        })
    })
});
