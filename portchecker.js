const readline = require('readline');
const ip = require('ip');
const Netmask = require('netmask').Netmask;
const http = require('http');
const ping = require('ping');
const keepAliveAgent = new http.Agent({ maxSockets:100});
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var timeout = 5000;

ipAdd = ip.address();
console.log('Your IP address: ' + ipAdd);

let block = new Netmask(ipAdd + '/16');
rl.question('Start Port: ', (port) => {
    rl.question('Port Array: ', (portArray) => {
        var Ports = Array.from(Array(parseInt(portArray)), (x,i) => i+parseInt(port));var IPs = [];
        block.forEach( (ip, long, index) => {
            IPs.push(ip);
        });
        IPs.forEach(function(host){
            ping.sys.probe(host, function(isAlive){
                if (isAlive) {
                    for (portx in Ports) {
                        (function(portx) {
                            var s = keepAliveAgent.createConnection({
                                host: host,
                                port: Ports[portx], 
                                family:4}, () =>{
                                console.log('OPEN: ' + host + ':' + Ports[portx])
                            });
                            s.on('data', function(data){
                                console.log('DATA: ' + host + ':' + Ports[portx] + ", response: " + data)
                            });
                            s.setTimeout(timeout, function() { 
                                s.destroy(); 
                            });
                            s.on('error', function() {
                                s.destroy();
                            });
                        })(portx);
                    };
                }
            });
        });
        rl.close();
    })
});
