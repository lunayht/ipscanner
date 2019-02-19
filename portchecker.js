var readline = require('readline');
var net = require('net');
var ip = require('ip');
var Netmask = require('netmask').Netmask;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var timeout = 5000;

ipAdd = ip.address();
console.log('Your IP address: ' + ipAdd);

let block = new Netmask(ipAdd + '/24');
rl.question('Start Port: ', (port) => {
    rl.question('Port Array: ', (portArray) => {
        var Ports = Array.from(Array(parseInt(portArray)), (x,i) => i+parseInt(port));
        // console.log(Ports);
        block.forEach( (ip, long, index) => {
            for (portx in Ports) {
                (function(portx) {
                    var s = new net.Socket();
                    s.setTimeout(timeout, function() { s.destroy(); });
                    s.connect(Ports[portx], ip, function() {
                        console.log('OPEN: ' + ip + ':' + Ports[portx]);
                    });
                    s.on('error', function(e) {
                        s.destroy();
                    });
                })(portx);
            };
        });
        rl.close();
    })
});